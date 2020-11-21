// Storage Controller
const StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));

            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
            return items;
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
                localStorage.setItem('items', JSON.stringify(items));
            });
        },
        deleteItemFromSrtorage: function(id){
            let items;
            items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
                localStorage.setItem('items', JSON.stringify(items));
            });
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();

// Item Controller
const ItemCtrl = (function() {
    // Item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // data structor
    const data = {
        // items : [
        //     // {id: 0, name: 'Steak Dinner', calories:1200},
        //     // {id: 1, name: 'Cookies', calories:400},
        //     // {id: 2, name: 'Ice cream', calories:300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem : null,
        totalCalories : 0
    }

    // Public Methods
    return {
        getItems: function(){
            return data.items;
        },
        addItems: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // parse calories to number
             calories = parseInt(calories);

             // create new item
             const newItem = new Item(ID, name, calories);

             data.items.push(newItem);

             return newItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            // Set total calories in data structure
            data.totalCalories = total;

            return data.totalCalories;

            
        },
        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        removeItem: function(id){
            const ids = data.items.map(function(item){
                return item.id;
            });
            const index = ids.indexOf(id);

            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
            return item;
        },
        logData: function(){
            return data;
        }
    }

})();

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList : '#item-list',
        listItems : '#item-list li',
        addBtn : '.add-btn',
        updateBtn : '.update-btn',
        removeBtn : '.remove-btn',
        backBtn : '.back-btn',
        clearAll : '.clear-btn',
        itemInputName : '#item-meal',
        itemInputCalories : '#item-calories',
        totalCalories : '.total-calories'
    }
    // Public Methods
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getInputItem: function(){
            return {
            name : document.querySelector(UISelectors.itemInputName).value ,
            calories : document.querySelector(UISelectors.itemInputCalories).value 
            }
        },
        addItemList: function(item){
            document.querySelector(UISelectors.itemList).style.display = 'block' ;
            // Create li elemnet
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = ` <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none' ;
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemInputName).value = '' ;
            document.querySelector(UISelectors.itemInputCalories).value = '' ;
        },
        addItemToForm:function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.itemInputName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemInputCalories).value = ItemCtrl.getCurrentItem().calories ;
        },
        updateItemList: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        removeListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearListItem: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none' ;
            document.querySelector(UISelectors.updateBtn).style.display = 'inline' ;
            document.querySelector(UISelectors.removeBtn).style.display = 'inline' ;
            document.querySelector(UISelectors.backBtn).style.display = 'inline' ;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline' ;
            document.querySelector(UISelectors.updateBtn).style.display = 'none' ;
            document.querySelector(UISelectors.removeBtn).style.display = 'none' ;
            document.querySelector(UISelectors.backBtn).style.display = 'none' ;
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function(){
            return UISelectors;
        }
    }

})();

// App controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event listeners
    const loadEventListeners = function() {
        // UI selectors
        const UISelectors = UICtrl.getSelectors();
        // Add button event
        document.querySelector(UISelectors.addBtn).addEventListener('click', addItemSubmit);
        // Disable enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        document.querySelector(UISelectors.itemList).addEventListener('click', ItemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click' , updateItemSubmit);

        document.querySelector(UISelectors.backBtn).addEventListener('click', backBtnFn);

        document.querySelector(UISelectors.removeBtn).addEventListener('click', removeItemSubmit);

        document.querySelector(UISelectors.clearAll).addEventListener('click', clearAllItemsClick)
    }
    const addItemSubmit = function(e){
        const input = UICtrl.getInputItem();
        if(input.name !== '' && input.calories !==''){
            const newItem = ItemCtrl.addItems(input.name, input.calories);

            UICtrl.addItemList(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem);

            UICtrl.clearInput();
        }


        e.preventDefault();
    }
    const ItemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
            UICtrl.showEditState();

        }

        e.preventDefault();
    }
    const backBtnFn = function(e){
        UICtrl.clearEditState();
        e.preventDefault();
    }
    const updateItemSubmit = function(e){
        const input = UICtrl.getInputItem();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateItemList(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }
    const removeItemSubmit = function(e){
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.removeItem(currentItem.id);
        UICtrl.removeListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromSrtorage(currentItem.id);

        UICtrl.clearEditState();
        e.preventDefault();
    }
    const clearAllItemsClick = function(e){
        ItemCtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearListItem();
        StorageCtrl.clearItemsFromStorage();
        UICtrl.hideList();


        e.preventDefault();
    }
    return {
        init: function() {
            // Clear Edit State
            UICtrl.clearEditState();
            //fetch data from Item controller
            const items = ItemCtrl.getItems();
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                //Insert list items
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            // load event listeners
            loadEventListeners();

        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);


// Initialize app
App.init();