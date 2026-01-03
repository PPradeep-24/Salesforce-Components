import LightningDatatable from 'lightning/datatable';
import lookupColumn from './lookupColumn.html';


export default class CustomLookupDatatable extends LightningDatatable {
    static customTypes = {
        customLookup: {
            template: lookupColumn,
            standardCellLayout: true,
            editable: true,
            typeAttributes: ['accountName', 'contactId', 'fieldApi']
        }
    };
}
