new Vue({
  el: '#app',
  data: {
    listings: [],
    selectedListingId: '',
    messageText: '',
    successMessage: '',
    errorMessage: ''
  },
  mounted() {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        this.listings = data;
      });
  },
  methods: {
    sendMessage() {
      this.successMessage = '';
      this.errorMessage = '';

      if (!this.selectedListingId || !this.messageText.trim()) {
        this.errorMessage = "Please select a book and enter a message.";
        return;
      }

      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: this.selectedListingId,
          message_text: this.messageText
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.successMessage = "Message sent successfully!";
          this.messageText = '';
        } else {
          this.errorMessage = "Failed to send message.";
        }
      })
      .catch(() => {
        this.errorMessage = "Something went wrong.";
      });
    }
  }
});
