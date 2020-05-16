const options = {
    valueNames: ['id', 'name', 'chance', 'color'],
    item: 'template-item'
};

// Init list
const peopleList = new List('people', options);

let idField = $('#id-field'),
    nameField = $('#name-field'),
    chanceField = $('#chance-field'),
    addBtn = $('#add-btn'),
    editBtn = $('#edit-btn').hide(),
    removeBtns = $('.remove-item-btn'),
    editBtns = $('.edit-item-btn');

// Sets callbacks to the buttons in the list
refreshCallbacks();

function getRandomColor() {
    let letters = '0123456789';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 10)];
    }
    return color;
}

addBtn.click(function() {

    const newPlayer = {
        id: Math.floor(Math.random()*110000),
        name: nameField.val(),
        chance: parseInt(chanceField.val()),
        color: getRandomColor()
    }
    if(newPlayer.name.length < 1) { return }
    if(newPlayer.chance < 1) { return }

    //spinnerAdd(newPlayer)

    peopleList.add(newPlayer);
    const res = peopleList.get("id", newPlayer.id);
    res[0].elm.style.color = res[0]._values.color
    spinnerAdd();

    clearFields();
    refreshCallbacks();
});

editBtn.click(function() {
    var item = peopleList.get('id', idField.val())[0];
    item.values({
        id:idField.val(),
        name: nameField.val(),
        chance: chanceField.val(),
    });
    clearFields();
    editBtn.hide();
    addBtn.show();
});

function refreshCallbacks() {
    // Needed to add new buttons to jQuery-extended object
    removeBtns = $(removeBtns.selector);
    editBtns = $(editBtns.selector);

    removeBtns.click(function() {
        var itemId = $(this).closest('tr').find('.id').text();
        peopleList.remove('id', itemId);
    });

    editBtns.click(function() {
        var itemId = $(this).closest('tr').find('.id').text();
        var itemValues = peopleList.get('id', itemId)[0].values();
        idField.val(itemValues.id);
        nameField.val(itemValues.name);
        chanceField.val(itemValues.chance);

        editBtn.show();
        addBtn.hide();
    });
}

function clearFields() {
    nameField.val('');
    chanceField.val('');
}