public with sharing class AusContactsController {
    public class ContactRow {
        @AuraEnabled public Id Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Email;
        @AuraEnabled public String Phone;
        @AuraEnabled public Id AccountId;
        @AuraEnabled public String AccountName;
        @AuraEnabled public String MailingCity;
        @AuraEnabled public String MailingState;
        public ContactRow(Contact c) {
            this.Id = c.Id;
            this.Name = c.Name;
            this.Email = c.Email;
            this.Phone = c.Phone;
            this.AccountId = c.AccountId;
            this.AccountName = (c.AccountId != null && c.Account != null) ? c.Account.Name : null;
            this.MailingCity = c.MailingCity;
            this.MailingState = c.MailingState;
        }
    }

    public class AccountOption {
        @AuraEnabled public Id id;
        @AuraEnabled public String name;
        public AccountOption(Account a) {
            this.id = a.Id;
            this.name = a.Name;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<ContactRow> getAusContacts() {
        List<ContactRow> rows = new List<ContactRow>();
        for (Contact c : [
            SELECT Id, Name, Email, Phone, AccountId, Account.Name, MailingCity, MailingState
            FROM Contact
            WHERE MailingCountry = 'Australia'
            ORDER BY LastModifiedDate DESC
            LIMIT 2000
        ]) {
            rows.add(new ContactRow(c));
        }
        return rows;
    }

    @AuraEnabled
    public static void updateContactAccount(Id contactId, Id accountId) {
        if (contactId == null) {
            throw new AuraHandledException('contactId is required');
        }
        update new Contact(Id = contactId, AccountId = accountId);
    }

    @AuraEnabled(cacheable=true)
    public static List<AccountOption> searchAccountsByName(String searchKey, Integer limitSize) {
        Integer lim = (limitSize == null || limitSize <= 0 || limitSize > 100) ? 25 : limitSize;
        if (String.isBlank(searchKey)) {
            return new List<AccountOption>();
        }
        String likeKey = '%' + String.escapeSingleQuotes(searchKey) + '%';
        List<AccountOption> outList = new List<AccountOption>();
        for (Account a : [
            SELECT Id, Name
            FROM Account
            WHERE Name LIKE :likeKey
            ORDER BY Name
            LIMIT :lim
        ]) {
            outList.add(new AccountOption(a));
        }
        return outList;
    }
}
