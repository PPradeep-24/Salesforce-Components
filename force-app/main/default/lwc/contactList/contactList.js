import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import searchAccounts from '@salesforce/apex/ContactController.searchAccounts';
import updateContactAccount from '@salesforce/apex/ContactController.updateContactAccount';
import CONTACT_DATATABLE from 'c/contactListWithLookupDatatable';

export default class ContactList extends LightningElement {
    datatableType = CONTACT_DATATABLE;
    @track data = [];
    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        {
            label: 'Account',
            fieldName: 'AccountId',
            type: 'customLookup',
            typeAttributes: {
                accountName: { fieldName: 'AccountName' },
                contactId: { fieldName: 'Id' }
            }
        },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' }
    ];
    @track openModal = false;
    @track searchKey = '';
    @track accountResults = [];
    @track selectedContactId;

    @wire(getContacts)
    wiredContacts({ data, error }) {
        if (data) {
            this.data = data.map(rec => ({
                ...rec,
                AccountName: rec.Account ? rec.Account.Name : ''
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handleAccountLookupClick(event) {
        console.log('@@@@Pradeep');
        this.selectedContactId = event.detail.contactId;
        this.openModal = true;
        this.accountResults = [];
        this.searchKey = '';
    }

    handleCloseModal() {
        this.openModal = false;
    }

    handleSearchChange(event) {
        this.searchKey = event.target.value;
        if (this.searchKey.length > 1) {
            searchAccounts({ searchKey: this.searchKey })
                .then(result => {
                    this.accountResults = result;
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            this.accountResults = [];
        }
    }

    handleSelectAccount(event) {
        const accountId = event.currentTarget.dataset.id;
        const accountName = event.currentTarget.dataset.name;

        // updateContactAccount({ contactId: this.selectedContactId, accountId })
        //     .then(() => {
        //         this.openModal = false;
        //         this.data = this.data.map(row => {
        //             if (row.Id === this.selectedContactId) {
        //                 return { ...row, AccountId: accountId, AccountName: accountName };
        //             }
        //             return row;
        //         });
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });
    }
}
