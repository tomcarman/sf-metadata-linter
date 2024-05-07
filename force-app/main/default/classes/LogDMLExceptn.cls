/**
* @author tomcarman 
* @description Subclass of Log.cls to create Logs specific to DMLExceptions
*/
public class LogDMLExceptn extends Log {

    /**
     * @description An instance of a DML Exception
     */
    private DMLException dmlEx;


    /**
     * @description Constructor
     * @param dmlEx the DML exception to create the log from
     */
    public LogDMLExceptn(DMLException dmlEx) {
        
        this.dmlEx = dmlEx;
        this.recordId = dmlEx.getDmlId(0);
        this.logType = 'DML Exception Log';
        this.data = buildData();
        this.severity = LogSeverity.ERROR;

    }


    /**
     * @description Helper method to extract details from the DML exception and format as JSON.
     */
    private String buildData() {

        Map<String, Map<String, String>> exceptionMap = new Map<String, Map<String, String>>();

        Map<String, String> exceptionDetails = new Map<String, String>();

        exceptionDetails.put('ExceptionType', dmlEx.getTypeName());
        exceptionDetails.put('LineNumber', String.valueOf(dmlEx.getLineNumber()));
        exceptionDetails.put('Message', dmlEx.getMessage());
        exceptionDetails.put('StackTrace', dmlEx.getStackTraceString());

        exceptionMap.put('Exception Details', exceptionDetails);

        for (Integer i = 0; i < dmlEx.getNumDml(); i++) {
            Map<String, String> dmlExceptionMap = new Map<String, String>();
            dmlExceptionMap.put('Id', dmlEx.getDmlId(i));
            dmlExceptionMap.put('Message', dmlEx.getDmlMessage(i));
            dmlExceptionMap.put('StatusCode', dmlEx.getDmlStatusCode(i));
            dmlExceptionMap.put('FieldNames', String.join(dmlEx.getDmlFieldNames(i), ', '));
            exceptionMap.put('Row ' + String.valueOf(i), dmlExceptionMap);
        }

        return JSON.serializePretty(exceptionMap);
        
    }

}