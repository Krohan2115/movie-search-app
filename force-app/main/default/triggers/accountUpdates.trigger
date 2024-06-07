trigger accountUpdates on Account (before update, after update) {
    /*if(Trigger.isUpdate){
        if(Trigger.isBefore){
            accountTriggerHandler.updateAccountNumber(Trigger.new, Trigger.oldMap);
        }
    }*/
    if(Trigger.isUpdate){
        if(Trigger.isAfter){
            accountTriggerHandler.updateContact(Trigger.new, Trigger.oldMap);
        }
    }
	
}