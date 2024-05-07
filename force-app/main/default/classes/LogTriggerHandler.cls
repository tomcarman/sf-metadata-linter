/**
* @author tomcarman 
* @description Platform Event Trigger handler on Log__e
*/
public class LogTriggerHandler {
    
    public void onAfterInsert(List<Log__e> triggerNewList){

        List<Log_Event__c> logsToStore = new List<Log_Event__c>();

        for(Log__e logEvent : triggerNewList) {
            
            logsToStore.add(
                new Log_Event__c(
                    Data__c = logEvent.Data__c,
                    Location__c = logEvent.Location__c,
                    Quiddity__c = logEvent.Quiddity__c,
                    Transaction_Id__c = logEvent.Transaction_Id__c,
                    Running_User__c = logEvent.Running_User__c,
                    Severity__c = logEvent.Severity__c,
                    Type__c = logEvent.Type__c
                )
            );
        }


        // Logging code should be non-blocking (even if its in its own Platform Event transaction), so 
        // allow it to error and output to debug.
        List<Database.SaveResult> saveResults = Database.insert(logsToStore, false);
        for(Database.SaveResult saveResult : saveResults) {
            if(!saveResult.isSuccess()) {
                System.debug('A Log__e was published, but failed to save due to the following error(s):');
                for(Database.Error error : saveResult.getErrors()) {
                    System.debug(error.getMessage());
                }
            }
        }

    }

}