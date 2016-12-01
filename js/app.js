jQuery(document).ready(function(){
// function to compare code currency to my table with json file
    function searchCurrency(response){
                    
                    var array = response[0].rates;
                    var currencyToInner = jQuery('.toChange');
                    //console.log(currencyToInner.hasClass('EUR'));
                    currencyToInner.each(function(){
                        for (i=0;i<array.length;i++){
                            if ((jQuery(this).text())==array[i].code){
                                var rateToNum = Math.round(parseFloat(array[i].mid)*10000)/10000;
                                jQuery(this).text(rateToNum);
                            }  //if
                        } // for
                    }) // function
                };//finish function searchCurrency
    function loadRate() {
            $.ajax({
                    url: 'http://api.nbp.pl/api/exchangerates/tables/a/',
                    dataType: 'json'
            }).done(function(response){
                // input data
                jQuery('.dataToInput').text(response[0].effectiveDate);
                searchCurrency(response);    
            }).fail(function(error) {
               console.log(error);
            }) // finish fail    
    }; //finish loadRate
        loadRate();
    // action on click to exchange currency
    jQuery('.count-btn').on('click', function(event){
        jQuery('#chartDraw').empty();
        var amount = jQuery('.amount-input').val();
        var result = 0;
        var currencyFrom = jQuery('.currencyFrom :selected').data('currency');
        var currencyTo = jQuery('.currencyTo :selected').data('currency');
            if (amount>1000000){
                jQuery('.text-error-milion').addClass('case-error');
                jQuery('.hide-result').removeClass('show-result');
                jQuery('.chart').removeClass('show-result');
                return false;
            }
        //case for amoount<0
            else if (amount<=0 || amount==''){
                    jQuery('.text-error-amount').addClass('case-error');
                    jQuery('.hide-result').removeClass('show-result');
                    jQuery('.chart').removeClass('show-result');
                    return false;
                }
            else{
                    jQuery('.text-error-amount').removeClass('case-error')
                }
        // add condition for the replacement of the same currency
            if (currencyFrom == currencyTo){
                jQuery('.text-error-curency').addClass('case-error');
                jQuery('.hide-result').removeClass('show-result');
                jQuery('.chart').removeClass('show-result');
                
                return false;
            }
            else{
                jQuery('.text-error-curency').removeClass('case-error');
                jQuery('.text-error-milion').removeClass('case-error');
            }
            drawTheChart(currencyFrom,currencyTo,20)
            
        // calculate the result and decimal to 2 place and rate to 4 place
        var rate = Math.round((jQuery('.'+currencyFrom).text())/(jQuery('.'+currencyTo).text())*10000)/10000;
        result = Math.round(amount * rate *100)/100;
        //innet results
        jQuery('.hide-result').addClass('show-result');  
        jQuery('.chart').addClass('show-result');
        jQuery('.amount-input').text(amount + ' ' + currencyFrom);
        jQuery('.restul-input').text(result + ' ' + currencyTo);
        jQuery('.exchange-input').text('1  ' + currencyFrom + ' = ' + rate+ ' ' + currencyTo );

        jQuery('.main-content').on('click','.range-btn',function(event){
            var numDay =jQuery(this).val();
            drawTheChart(currencyFrom,currencyTo,numDay);
        event.preventDefault;
    })
        event.preventDefault();
    });//finish event
    jQuery('.change-btn').on('click', function(event){
        var changeFrom = jQuery('.currencyFrom').val();
        var changeTo = jQuery('.currencyTo').val();
        jQuery('.currencyTo').val(changeFrom);
        jQuery('.currencyFrom').val(changeTo);
    })
    function drawTheChart (el1, el2, el3){
         if (el1=='PLN'){
            takeFirstPln(el2, el3);
            }
        else if (el2 =='PLN'){
            takeSecondPln(el1, el3);
        }
        else{
           takeForeignData(el1,el2,el3); 
        }
    }
}); // finish ready    