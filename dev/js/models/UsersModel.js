app.factory('Book', ['$http', function($http) {  
    function Book(bookData) {
        if (bookData) {
            this.setData(bookData):
        }
        // Some other initializations related to book
    };
    Book.prototype = {
        setData: function(bookData) {
            angular.extend(this, bookData);
        },
        delete: function() {
            $http.delete('ourserver/books/' + bookId);
        },
        update: function() {
            $http.put('ourserver/books/' + bookId, this);
        },
        getImageUrl: function(width, height) {
            return 'our/image/service/' + this.book.id + '/width/height';
        },
        isAvailable: function() {
            if (!this.book.stores || this.book.stores.length === 0) {
                return false;
            }
            return this.book.stores.some(function(store) {
                return store.quantity > 0;
            });
        }
    };
    return Book;
}]);