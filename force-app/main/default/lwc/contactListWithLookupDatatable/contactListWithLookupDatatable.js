import LightningDatatable from 'lightning/datatable';
import customLookupTemplate from 'c/customLookup';

export default class ContactListWithLookupDatatable extends LightningDatatable {
    static customTypes = {
        customLookup: {
            template: customLookupTemplate,
            standardCellLayout: true,
            typeAttributes: ['accountName', 'contactId', 'fieldApi']
        }
    };
}
