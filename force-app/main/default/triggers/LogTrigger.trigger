trigger LogTrigger on Log__e(after insert) {

    LogTriggerHandler handler = new LogTriggerHandler();
   
    if(Trigger.isAfter && Trigger.isInsert) {
        handler.onAfterInsert(Trigger.new);
    }
} 