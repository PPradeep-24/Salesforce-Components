public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT Id, Name, Email, Phone, AccountId, Account.Name FROM Contact  where AccountId!=null LIMIT 10 ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchKey) {
        return [
            SELECT Id, Name FROM Account
            WHERE Name LIKE :('%' + searchKey + '%')
            LIMIT 10
        ];
    }

    @AuraEnabled
    public static void updateContactAccount(Id contactId, Id accountId) {
        Contact c = [SELECT Id FROM Contact WHERE Id = :contactId LIMIT 1];
        c.AccountId = accountId;
        update c;
    }
}
