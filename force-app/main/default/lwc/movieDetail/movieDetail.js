import { LightningElement, wire, track } from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

export default class MovieDetail extends LightningElement {
    subscription = null;
    loadComponent = false;
    movieDetails = {};
    @track isPlotLong = false;
    @track showFullPlot = false;
    @track shortPlot = '';
    @track showMoreText = 'More';

    @wire(MessageContext)
    messageContext;

    // Standard lifecycle hooks used to subscribe and unsubscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Encapsulate logic for Lightning message service subscribe and unsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    // Handler for message received by component
    handleMessage(message) {
        let movieId = message.movieId;
        console.log("movieId", movieId);
        this.fetchMovieDetail(movieId);
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    async fetchMovieDetail(movieId) {
        let url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=48e5c3c0`;
        const res = await fetch(url);
        const data = await res.json();
        console.log("Movie Details", data);
        this.loadComponent = true;
        this.movieDetails = data;

        // Reset showFullPlot and showMoreText
        this.showFullPlot = false;
        this.showMoreText = 'More';

        if (data.Plot.length > 150) {
            this.isPlotLong = true;
            this.shortPlot = data.Plot.substring(0, 150) + '...';
        } else {
            this.isPlotLong = false;
            this.shortPlot = data.Plot;
        }
    }

    togglePlot() {
        this.showFullPlot = !this.showFullPlot;
        if (this.showFullPlot) {
            this.shortPlot = this.movieDetails.Plot;
            this.showMoreText = 'Less';
        } else {
            this.shortPlot = this.movieDetails.Plot.substring(0, 150) + '...';
            this.showMoreText = 'More';
        }
    }
}
