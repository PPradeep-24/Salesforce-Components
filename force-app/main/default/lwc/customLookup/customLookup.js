import { LightningElement, api,track} from 'lwc';

export default class CustomLookup extends LightningElement {
    @api accountName;
    @api contactId;
    @api fieldApi;
    @track iconClass = 'hidden-icon';
    @track searchicon= 'hidden-icon';
    @track value

    handleIconClick() {
        console.log('@@@@@','KANNA')
        const event = new CustomEvent('accountlookupclick', {
            detail: {
                value: this.value,
            },
            bubbles: true,
            composed:true       });
        this.dispatchEvent(event);
    }
    

    @track isDisabled = true;

    showIcon() {
        this.iconClass = 'visible-icon';
    }

    hideIcon() {
        this.iconClass = 'hidden-icon';
    }

    handleEditClick() {
        this.isDisabled = false; // make editable
        // Wait a tick to focus after rendering
        setTimeout(() => {
            const input = this.template.querySelector('lightning-input');
            if (input) input.focus();
        }, 0);
    }

    handleChange(event) {
        this.value = event.target.value;
        this.searchicon='lookup-icon';
         this.iconClass = 'hidden-icon';
    }

    handleBlur() {
        this.isDisabled = true; // lock again on blur
    }


}
