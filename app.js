
// Budget Controller
var budgetController = (function () {
    //New keyword creates a new empty object and calls the function and points to this keyword of that func to the new object

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
    }

    Expense.prototype.calcPercentage=function(totalIncome){

        if(totalIncome>0){

            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
        
        
             
    };

    Expense.prototype.getPercentage=function(){

        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id
        this.description = description
        this.value = value
    }

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {

            sum += current.value
        });
        data.totals[type] = sum;

    }

    var data = {
        allItems: {
            exp: [],    //Array for storing each expense record
            inc: []    //Array for storing each income record
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,      // Income-expense or available Balance
        percentage: 0
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID

            //Create new Id

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 //ID for new item

            }
            else {
                ID = 0
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, des, val)
            }
            else {
                newItem = new Income(ID, des, val)
            }

            //Push it to our data structure
            data.allItems[type].push(newItem)

            //Return new item
            return newItem
        },


        deleteItem: function (type, ID) {

            var ids,index;

             // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3
            
            
            
            
            ids = data.allItems[type].map(function(current) {
                return current.id          // To return all id of exp/inc array value
            }
            );
            

            index=ids.indexOf(ID);         //To get the index value of desired ID
            
            
            
            

            if(index!==-1){
                data.allItems[type].splice(index,1)      //Splice is used to remove a value from an array
            }                                            //In python we use slice() and in javascript Splice()

        },

        
        calculateBudget: function () {

            //Calculate total income and expense

            calculateTotal("inc");
            calculateTotal("exp");

            //Calculate the budget: income-expense

            data.budget = data.totals["inc"] - data.totals["exp"]

            //Calculate the percentage of expense that we spent

            if (data.totals.exp > 0) {
                //data.percentage = Math.round((data.totals["exp"] / data.totals["inc"]) * 100);
                data.percentage = (data.totals["exp"] / data.totals["inc"]) * 100;
            }
            else {
                data.percentage = -1;
            }


        },
        getBudget: function () {        
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        calculatePercentages:function(){        // made this because to call calcpercentage() to calculate the percentage

            data.allItems.exp.forEach(function(curr){
                curr.calcPercentage(data.totals.inc)
            })
            
             

        },
        getPercentages(){
                
            var allPerc=data.allItems.exp.map(function(curr){       //this will return percentage into an array
                return curr.getPercentage();
            });
            return allPerc;
        },

        testing: function () {
            return data
        }

    }
})();




//UI controller

var UIController = (function () {
    //write your code here

    var DOMstring = {

        inputType: '.add__type',
        inputDesc: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
    var nodeListForEach=function(list,callback){
                
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                desc: document.querySelector(DOMstring.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstring.inputValue).value)
            }

        },
        addListItem: function (obj, type) {

            var html, newHtml, element
            
            //Create Html string with plceholder
            if (type === "inc") {
                element = ".income__list"
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === "exp") {
                element = ".expenses__list"
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %description%</div><div class="right clearfix"><div class="item__value">%value% </div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Replace the place holder text with some actual data
            newHtml = html.replace("%id%", obj.id)
            newHtml = newHtml.replace("%description%", obj.description)
            newHtml = newHtml.replace("%value%", formatNumber(obj.value,type))

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)

        },
        deleteListItem:function(selectorID){

            element=document.getElementById(selectorID);
            element.parentNode.removeChild(element);   
            
            // We can only remove the child(using DOM),so we move up using parentNode and then remove the child
            

        },
        clearFields: function () {
            var fields, fieldsArr

            fields = document.querySelectorAll(DOMstring.inputDesc + "," + DOMstring.inputValue)
            fieldsArr = Array.prototype.slice.call(fields)
            //Have a look on Mozilla about above function
            fields.forEach(function (current, index, array) {
                current.value = ""
            })
            fieldsArr[0].focus(); //To focus back on description after enter
        },
        displayBudget: function (obj) {

            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(DOMstring.expensesLabel).textContent = formatNumber(obj.totalExp,"exp");

            if (obj.percentage > 0) {
                document.querySelector(DOMstring.percentageLabel).textContent = parseInt(obj.percentage) + '%';
            } else {
                document.querySelector(DOMstring.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstring.expensesPercLabel);      // This will create nodeList and we can't use forEach on it.

            nodeListForEach(fields, function (curr, index) {

                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + "%";
                }
                else {
                    curr.textContent = '---';
                }



            });

        },  
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;
        },   
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' +
                DOMstring.inputDesc + ',' +
                DOMstring.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstring.inputBtn).classList.toggle('red');
            
        },

        getDOMstring: function () {
            return DOMstring
        }
    }
})();

//Global App Controller

var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function () {

        var DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem)

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem); //whenever somene clicks on conatiner or its child element it triggers
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType); 

    };

    var updateBudget = function () {

        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3.Display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
                
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {

        var input, newItem

        // 1.Get the input data 
        input = UICtrl.getInput()
        if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {

            // 2.Add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value)

            //console.log(budgetCtrl.testing().allItems[input.type][].value)

            // 3.Add the item to UI
            UICtrl.addListItem(newItem, input.type)

            // 4. Clear the fields
            UICtrl.clearFields()

            // 5. calculate and update budget
            updateBudget()

            // 6. Calculate and update the percentages
            updatePercentages();

        }
    }

     var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if (itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
                       
            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type,ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
           updateBudget()
            
            // 4. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            UICtrl.displayMonth()
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            })
            setupEventListener()
        }
    }

})(budgetController, UIController);

controller.init()