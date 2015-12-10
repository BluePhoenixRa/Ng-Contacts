'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

// Contacts Controller
.controller('ContactsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
  // Initialize Firebase
  var ref = new Firebase('https://ng-contacts-ra.firebaseio.com/contacts');

  // Get Contacts
  $scope.contacts = $firebaseArray(ref);
  console.log($scope.contacts);

  // Show Form
  $scope.showAddForm = function() {
    $scope.addForm = true;
    clearFields();
    $scope.contactShow = false;
    $scope.editForm = false;
  }

  $scope.hideAddForm = function() {
    $scope.addForm = false;
  }

  $scope.addFormSubmit = function() {
    console.log("Adding New Contact");

    // Assign Values
    if($scope.fname){var fname = $scope.fname} else {var fname = null;}
    if($scope.lname){var lname = $scope.lname} else {var lname = null;}
    if($scope.email){var email = $scope.email} else {var email = null;}
    if($scope.company){var company = $scope.company} else {var company = null;}
    if($scope.work_phone){var work_phone = $scope.work_phone} else {var work_phone = null;}
    if($scope.cell_phone){var cell_phone = $scope.cell_phone} else {var cell_phone = null;}
    if($scope.street_address){var street_address = $scope.street_address} else {var street_address = null;}
    if($scope.city){var city = $scope.city} else {var city = null;}
    if($scope.state){var state = $scope.state} else {var state = null;}
    if($scope.zipcode){var zipcode = $scope.zipcode} else {var zipcode = null;}

    // Build Object in JSON format
    $scope.contacts.$add({
      fname: fname,
      lname: lname,
      email: email,
      company: company,
      phones: [
        {
          work: work_phone,
          cell: cell_phone
        }
      ],
      address: [
        {
          street_address: street_address,
          city: city,
          state: state,
          zipcode: zipcode
        }
      ]
    }).then(function(ref){
      var id = ref.key();
      console.log('Added Contact with ID: ' + id);

      // Clear Fields
      clearFields();

      // Hide Form
      $scope.addForm = false;

      // Show Message
      $scope.msg = "Contact Added";
    });
  }

  $scope.hideContactShow = function() {
    $scope.contactShow = false;
  }

  $scope.showContact = function(contact) {
    console.log('Get Contact');

    $scope.fname = contact.fname;
    $scope.lname = contact.lname;
    $scope.email = contact.email;
    $scope.company = contact.company;
    $scope.work_phone = contact.phones[0].work;
    $scope.cell_phone = contact.phones[0].cell;
    $scope.street_address = contact.address[0].street_address;
    $scope.city = contact.address[0].city;
    $scope.state = contact.address[0].state;
    $scope.zipcode = contact.address[0].zipcode;

    $scope.contactShow = true;
  }

  // Show Edit Form
  $scope.hideEditForm = function() {
    $scope.editForm = false;
  }

  $scope.showEditForm = function(contact) {
    $scope.editForm = true;

    $scope.id = contact.$id;
    $scope.fname = contact.fname;
    $scope.lname = contact.lname;
    $scope.email = contact.email;
    $scope.company = contact.company;
    $scope.work_phone = contact.phones[0].work;
    $scope.cell_phone = contact.phones[0].cell;
    $scope.street_address = contact.address[0].street_address;
    $scope.city = contact.address[0].city;
    $scope.state = contact.address[0].state;
    $scope.zipcode = contact.address[0].zipcode;
  }

  // Edit Form
  $scope.editFormSubmit = function() {
    console.log('Updating Contact');

    var id = $scope.id;
    var record = $scope.contacts.$getRecord(id);

    record.fname = $scope.fname;
    record.lname = $scope.lname;
    record.email = $scope.email;
    record.company = $scope.company;
    record.phones[0].work = $scope.work_phone;
    record.phones[0].cell = $scope.cell_phone;
    record.address[0].street_address = $scope.street_address;
    record.address[0].city = $scope.city;
    record.address[0].state = $scope.state;
    record.address[0].zipcode = $scope.zipcode;

    // Push update
    $scope.contacts.$save(record).then(function(ref){
      console.log(ref.key);
    });

    clearFields();

    $scope.editForm = false;

    $scope.msg = "Edited successfully!"

  }

  // Clear all fields
  function clearFields(){
    console.log('Clear All Fields');

    $scope.fname = '';
    $scope.lname = '';
    $scope.email = '';
    $scope.company = '';
    $scope.work_phone = '';
    $scope.cell_phone = '';
    $scope.street_address = '';
    $scope.city = '';
    $scope.state = '';
    $scope.zipcode = '';
  }

  // Remove function
  $scope.removeContact = function(contact){
      console.log('Removing Contact');

      $scope.contacts.$remove(contact);

      $scope.msg = "Contact Deleted Successfully";
  }

}]);
