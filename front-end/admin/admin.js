/* TODO
    - Add button functionality
    - How to edit users/products
*/

function sideContentUpdate(selector, data) {
    //template
    data.forEach((tmp, idx) => {
        let edit = $('<button id="edit">Edit</button>');
        let del = $('<button id="delete">Delete</button>');
        let main = $(`
            <div class="item" id="${idx}">
                <a>${tmp}</a>
                <div class="buttons"></div>
            </div>
            `)

        edit.appendTo(main.children('.buttons'));
        del.appendTo(main.children('.buttons'));
        $(selector + " #list-items").append(main);
    });
}

let tmp = ["tmp1", "tmp2", "tmp3", "tmp4", "tmp5", "tmp6"]
function webLoad() {
    //Load side content
    sideContentUpdate('#categories-container', tmp);
    sideContentUpdate('#stockist-container', tmp)
}

$(document).ready(webLoad);