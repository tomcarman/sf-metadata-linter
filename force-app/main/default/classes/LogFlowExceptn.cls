/**
* @author ElganEllis 
* @description Subclass of Log.cls to create Logs specific to Flow Exceptions
*/
public class LogFlowExceptn extends Log {

    /**
     * @description An instance of a Flow Exception
     */
    private FlowException ex;

    /**
     * @description Constructor
     * @param ex the flow exception to create the log from
     */
    public LogFlowExceptn(FlowException ex) { 
        
        this.ex = ex;
        this.logType = 'Flow Exception Log';
        this.data = buildData();
        this.severity = LogSeverity.ERROR; // Exceptions are always considered errors

    }




    /**
     * @description Helper method to extract details from the exception and format as JSON.
     */
    private String buildData() {
        
        Map<String, String> exceptionMap = new Map<String, String>();
        exceptionMap.put('ExceptionType', ex.getTypeName());
        exceptionMap.put('Message', ex.getMessage());

        if(ex.failingActionName != null){

            location= 'Flow: '+ ex.flowName+ ', Action:'+ex.failingActionName;

        } else {

            location= 'Flow: '+ ex.flowName;
            
        }

        return JSON.serializePretty(exceptionMap);
        
    }


}