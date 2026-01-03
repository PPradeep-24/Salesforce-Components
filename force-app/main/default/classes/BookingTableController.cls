public with sharing class BookingTableController {
    @AuraEnabled(cacheable=true)
    public static List<Booking__c> getBookings() {
        return [
            SELECT Id, Name, Age__c, BookingCustomer__c, BookingCustomer__r.Name
            FROM Booking__c
            ORDER BY CreatedDate DESC
            LIMIT 200
        ];
    }

    @AuraEnabled
    public static void updateBookings(List<Booking__c> bookings) {
        if (bookings == null || bookings.isEmpty()) return;
        update bookings;
    }

    @AuraEnabled(cacheable=true)
    public static List<User> searchUsers(String searchTerm, Integer limitSize) {
        String term = (searchTerm == null) ? '' : searchTerm.trim();
        Integer lim = (limitSize == null || limitSize <= 0) ? 10 : limitSize;
        if (String.isBlank(term)) {
            return [
                SELECT Id, Name, Email
                FROM User
                WHERE IsActive = true
                ORDER BY LastName
                LIMIT :lim
            ];
        } else {
            String likeTerm = '%' + term.replaceAll('[%_]', '\\\\$0') + '%';
            return [
                SELECT Id, Name, Email
                FROM User
                WHERE IsActive = true AND (Name LIKE :likeTerm OR Email LIKE :likeTerm)
                ORDER BY LastName
                LIMIT :lim
            ];
        }
    }
}
