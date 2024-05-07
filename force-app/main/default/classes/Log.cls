/**
* @author tomcarman 
* @description Base class for all Log types. Common methods/atrributes should get added here, whilst
                specific implementations of different types of logs should extend this class - eg.
                LogExceptn, LogDMLExceptn.
*/

public virtual class Log {

    /**
     * @description String that describes the type of Log
     */
    protected String logType = 'Standard Log';


    /**
     * @description String of arbitrary data that forms the log. Recommended format is JSON, but can be anything.
     *              Limited to 131,072 characters
     */
    protected String data;


    /** 
     * @description Enum to represent the severity of the log - DEBUG, INFO, WARN, ERROR
     */
    protected LogSeverity severity;


    /**
     * @description Used to store any single recordId, eg. the Id of the record that initiated the transaction
     */
    protected Id recordId;


    /**
     * @description The internal Id of the Salesforce request (often called transaction) that is executing when this
     *              log is being created. Useful to correlate multiple logs created in a single execution.
     */
    protected String requestId {
        get {
            if(requestId == null) {
                requestId = Request.getCurrent()?.getRequestId();
            }
            return requestId;
        }
        protected set;
    }


    /**
     * description The quddity value of the request that is executing when this log is being created. 
     */
    protected Quiddity quiddity {
        get {
            if(quiddity == null) {
                quiddity = Request.getCurrent()?.getQuiddity();
            }
            return quiddity;
        }
        protected set;
    }

    /**
     * description Logic to determine the "location" of where the log was raised - eg. MyClass.myMethod Line 1 Column 1
     *              There is currently no native apex method to do this, so instead an Exception is constructed and then
     *              the stacktrace is traversed with regex to extract the class and method.
     *              Note: changes to the implementation of the Logger/Log classes could require a change to the line noted
     *                  below with an inline comment, as the stack trace could get deeper/shallower.
     */


    protected String location {
        
        get {

            if(location == null) {

                Map<String, String> locationMap = new Map<String, String>();

                try {

                    List<String> stackTraceLines = new DmlException().getStackTraceString().split('\n');
                    
                    String relevantLine = '';

                    if(stackTraceLines.size() >= 6) {
                        relevantLine = stackTraceLines[5];
                    } else if (stackTraceLines.size() >= 3) {
                        relevantLine = stackTraceLines[stackTraceLines.size()-2];
                    } else {
                        relevantLine = stackTraceLines[stackTraceLines.size()-1];
                    }

                    Matcher m = generateMatcher(relevantLine);

                    if (m.find()) {

                        if (String.isBlank(m.group(3))) {

                            locationMap.put('className', m.group(1));
                            locationMap.put('methodName',prettifyMethodName(m.group(2)));

                        } else {

                            locationMap.put('className', m.group(1) + '.' + m.group(2));
                            locationMap.put('methodName', prettifyMethodName(m.group(3)));

                        }

                        locationMap.put('line', String.valueOf(m.group(4)));
                        locationMap.put('column', String.valueOf(m.group(5)));
                    }

                    location = JSON.serializePretty(locationMap);

                } catch (Exception e) {
                    // Allow this to silently fail and print a debug, as this can be a little finicky, and we
                    // dont want block the creation of logs.
                    System.debug('Failed to identify location for Log: ' + e);
                }
            }

            return location; 
        }
   
        protected set;
    }
    


    /**
     * @description Default constructor - required to allow subclassing.
     */
    public Log(){}


    /**
     * @description Constructor
     * @param data an arbitrary string of data
     */
    public Log(String data){
        this(data, LogSeverity.INFO);
    }

    /**
     * @description Constructor
     * @param data an arbitrary string of data
     * @param severity LogSeverity enum
     */
    public Log(String data, LogSeverity severity){
        this.data = data;
        this.severity = severity;
    }


    /**
     * @description Method to convert this log into a Log__e Platform Event ready for publishing
     *              Overridable to allow different implementations of Log.cls to create different types of
     *              Platform Event.
     */
    public virtual SObject toEvent() {
        return new Log__e(
            Type__c	= this.logType,
            Severity__c = this.severity?.name(),
            Record_Id__c = this.recordId,
            Transaction_Id__c = this.requestId,
            Quiddity__c = this.quiddity?.name(),
            Location__c = this.location,
            Data__c = this.data,            
            Running_User__c = UserInfo.getUserId()
        );

    }

    


    /**
     * @description Tidy up method names for constructors and getter/setters when using the location property
     * @param  name Raw method name from stack trace
     */
    private String prettifyMethodName(String name) {
        return (name == null) ? null :
            name.replace('<init>', '(constructor) ')
                .replace('__sfdc_', '(getter/setter) ');
    }

    /**
     * @description Regex expression to extract class/method/line/column from a stack trace.
     * @param  firstLine Raw line of stack trace
     */
    private Matcher generateMatcher(String firstLine) {
        return Pattern.compile(
            '(?i)^(?:class\\.)?([^.]+)\\.?([^\\.\\:]+)?[\\.\\:]?([^\\.\\:]*): line (\\d+), column (\\d+)$'
        ).matcher(firstLine);
    }

}