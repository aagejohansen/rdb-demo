var rdb = require('rdb'),
    resetDemo = require('../db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

var db = rdb.sqlite(__dirname + '/../db/rdbDemo');


module.exports = resetDemo()
    .then(db.transaction)
    .then(getFilteredCustomers)
    .then(printCustomers)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getFilteredCustomers() {
    var filter = Customer.name.endsWith('nny');
    return Customer.getMany(filter);
}

function printCustomers(customers) {
    customers.forEach(printCustomer);

    function printCustomer(customer) {
        console.log('Customer Id: %s, name: %s', customer.id, customer.name);
    }
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}