import { LightningElement, api, wire, track } from 'lwc';
import getMessages from '@salesforce/apex/SP_SandeshAppController.getMessages';
import sendMessageApex from '@salesforce/apex/SP_SandeshAppController.sendMessage';
import { subscribe, unsubscribe} from 'lightning/empApi';
import { refreshApex } from '@salesforce/apex';
import Id from '@salesforce/user/Id';

export default class Sp_sandeshchatcomponent extends LightningElement {
    @api userDetail
    @track newMessage = '';
    @track messages = [];
    wiredMessages;
    currentUserId = Id;
    name;
    receiverId;
    channelName = '/event/SP_SandeshEvent__e';
    subscription
    

    @wire(getMessages, { receiverId: '$receiverId' })
    wiredGetMessages(result) {
        this.wiredMessages = result;
        if (result.data) {
            this.messages = result.data.map(msg => ({
                ...msg,
                cssClass: msg.OwnerId === this.currentUserId ? 'msg right' : 'msg left'
            }));
        } else if (result.error) {
            console.error('PRADEEP ERROR %%%',result.error);
        }
    }

    handleChange(event) {
        this.newMessage = event.target.value;
    }

    async sendMessage() {
        if (!this.newMessage.trim()) return;
        await sendMessageApex({ receiverId: this.receiverId, message: this.newMessage });
        this.newMessage = '';
        await refreshApex(this.wiredMessages);
    }
    connectedCallback() {
        this.handleSubscribe();
        this.receiverId = this.userDetail?.Id;
        this.name=this.userDetail.Name
    }

    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    scrollToBottom() {
        const container = this.template.querySelector('.chat-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
    renderedCallback(){
        this.scrollToBottom();
    }
    handleSubscribe() {
        const messageCallback = (response) => {
            console.log('New message received: ', JSON.stringify(response));
            if (this.currentUserId != response.data.payload.CreatedById) {
                const payload = response.data.payload;
                const newMessage = {
                    Id: `TEMP_${Date.now()}`,
                    OwnerId: payload.CreatedById,
                    SP_Receiver__c: this.currentUserId,
                    SP_Message__c: payload.SP_Message__c,
                    CreatedDate: payload.CreatedDate,
                    cssClass: 'msg left'
                };
                this.messages = [...this.messages, newMessage];
                this.scrollToBottom();
            }
        };
        subscribe(this.channelName, -1, messageCallback).then((response) => {
            console.log('Subscription successful: ', JSON.stringify(response));
            this.subscription = response;
        });
    }
    handleUnsubscribe() {
        unsubscribe(this.subscription, (response) => {
            console.log('unsubscribe() response: ', JSON.stringify(response));
        });
    }
    
}