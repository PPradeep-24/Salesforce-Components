import { LightningElement, api } from 'lwc';

export default class CustomLookupTemplate extends LightningElement {
    @api value;
    @api recordId;

    handleIconClick() {
        this.dispatchEvent(
            new CustomEvent('lookupclick', {
                bubbles: true,
                composed: true,
                detail: { recordId: this.recordId }
            })
        );
    }

    handleInputChange(event) {
        this.value = event.target.value;
    }
}
