public with sharing class SP_BirthdayWebsiteController {

    @AuraEnabled
    public static string loginMethod(String password,String siteUrl){
        try {
            String userName='pradeep.polaiah@accenture.com';
            ApexPages.PageReference lgn=Site.login(userName,password,siteUrl);
            return 'success';

        }catch (Exception e) {
            System.debug('ERROR OCCURED'+e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}