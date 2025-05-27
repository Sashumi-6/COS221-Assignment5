# COS221-Assignment5
###  link: https://wheatley.cs.up.ac.za/u24845061/COS221APITesting/api.php
username: u24845061
passwword: Carbon123
## u24845061 Ntuthuko, u24676412 Njabulo Integration Team

Categories api endpoint:
{
    type: Categories,
    operation: Add/Get/Delete/Update,
    apikey: user apikey,
    category_id : must be specified for Update and Delete,
    category_name : must be specified for Add and update,
    parent_category_name : name of this category's parent category
}

response from get  :
{
    category_id : int,
    category_name : string,
    parent_category_id : null/int,
    children : [
        {
            category_id : int,
            category_name : string,
            parent_category_id : null/int,
        }
    ]
}

When using \Delete, specify the category id. Omit category_name.

When using Add, specify name of category and it'll be added. Returned will be
the categories id. Omit category_id. 
ALSO if this category happens to "fall under" another 
e.g Phones falls under Electronics, 
included the name "Electronics" at parent_category_name

When Update specify both name and id. A message shall be returned.
========
User api endpoint:
{
    type: Users,
    operation: Get/Delete,
    apikey: Admin's apikey (will be verified),
    user_id : must be specified if using the delete operation
}

returned by Get operation:
{
    user_id,
    full_name,
    username,
    email,
    user_type
}

For security and practicality, the apikey, salt and password is not returned
========
Reviews api endpoint:
{
    type : Reviews,
    operation : Get/Add/Overall,
    apikey: A user's key (any user registered can review),
    upc : must be specified if using the Add, Get and Overall operation
    rating : must be specified for add,
    review : must be specified for add,
    username : must be specified for add,
    supplier_name : must be specified for add

}

returned by Add/Get operation:
{
    username of commentor,
    rating,
    review,
    supplier_name
}

Add will return specifically the new review (this will allow for real time 
additon), whereas get will the reviews of a specific product 
based on the UPC
========
GetOffers API endpoint:
{
    type : GetOffers,
    apikey : user key,
    upc : product's upc
}

response :
{
    status : success,
    timestamp : 111111121,
    data : [
        {
            offer_id,
            retailer_name,
            retailer_id,
            price
        }
    ]
}
========
AddOffer API endpoint:
{
    type : AddOffer,
    apikey : user key,
    upc : product's upc,
    retailer_name : name of retailer,
    price : product price,
    stock_count : available stock as int,
    delivery_time : string of delivery time e.g "5-7 Business days"
    shipping_fee : shipping fee amount
}

response (newly added offer, to enable possible real time update):
{
    status : success,
    timestamp : 111111121,
    data : {
        offer_id,
        retailer_name,
        price
    }
}

=====

UpdateOffer API endpoint:
{
    type : UpdateOffer,
    apikey : user key,
    upc : product associated with this offer,
    retailer_id : id of the retailer associated with this offer,
    field : must one of the following [price, stock_count, shipping_fee, delivery_time],
    new_value : the new value for the field
}

response :
{
    status : success,
    timestamp : 111111121,
    data : "Updated offer successfully"
}