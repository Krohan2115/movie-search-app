public class accountTriggerHandler {
	
    /*public static void updateAccountNumber(List<Account> accList, Map<Id, Account> oldAccMap){
        for(Account acc : accList){
            if(oldAccMap != null && acc.Industry != oldAccMap.get(acc.Id).Industry && acc.isAvailable__c == true){
                acc.AccountNumber = '1020';
            }
            else {
                acc.AccountNumber = '3040';
            }
            system.debug(acc.AccountNumber);
        }
    }*/
    
    public static void updateContact(List<Account> accList, Map<Id, Account> oldAccMap){
        List<Contact> contactsToUpdate = new List<Contact>();
        
        for(Account acc : accList){
            if(acc.Rating == 'Hot' &&  oldAccMap != null && acc.Phone != oldAccMap.get(acc.Id).Phone){
                List<Contact> relatedContacts = [SELECT Id, Phone FROM Contact WHERE AccountId = :acc.Id];
                
                for (Contact con : relatedContacts) {
                    con.Phone = acc.Phone;
                    system.debug('phone1'+con.Phone);
                    contactsToUpdate.add(con);
                }
                system.debug('phone2'+acc.Phone);
            System.debug('Contact to update: ' + relatedContacts);
            }
            
        }
        if (!contactsToUpdate.isEmpty()) {
            try {
                update contactsToUpdate;
            } catch (DmlException e) {
                System.debug('Error updating contacts: ' + e.getMessage());
            }
        }
    }
}