/**
* @author tomcarman 
* @description Subclass of Log.cls to create Logs specific to Exceptions
*/
public class LogExceptn extends Log {

    /**
     * @description An instance of a generic Exception
     */
    private Exception ex;


    /**
     * @description Constructor
     * @param ex the exception to create the log from
     */
    public LogExceptn(Exception ex) { 
        
        this.ex = ex;
        this.logType = 'Exception Log';
        this.data = buildData();
        this.severity = LogSeverity.ERROR; // Exceptions are always considered errors

    }


    /**
     * @description Helper method to extract details from the exception and format as JSON.
     */
    private String buildData() {
        
        Map<String, String> exceptionMap = new Map<String, String>();
        exceptionMap.put('ExceptionType', ex.getTypeName());
        exceptionMap.put('Line Number', String.valueOf(ex.getLineNumber()));
        exceptionMap.put('Message', ex.getMessage());
        exceptionMap.put('Stack Trace', ex.getStackTraceString());
        // exceptionMap.put('Cause', ex.getCause()); // TODO: Think about how to handle nested exceptions
        
        return JSON.serializePretty(exceptionMap);
        
    }


}