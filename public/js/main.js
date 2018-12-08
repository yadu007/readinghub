$(".proj-add-button").on("click", function () {

    let link = $('#post-add-link').val();
    let title = $('#post-add-title').val();
    let desc = $('#post-add-desc').val();
    if (!link || !title || !desc) {
        $(".modal-message").html('<div class="alert alert-danger alert-dismissible">\
    <button type="button" class="close" data-dismiss="alert">&times;</button>\
    <strong>Yikes!:</strong> Fields Should not be empty\
  </div>')
        return;
    }
    $.getJSON('/create_post', {
        link: link,
        title: title,
        desc: desc
    }, function (data) {
        if (data) {
            if (data.status == "ok") {
                $('#post-add-link').val("");
                $('#post-add-title').val("");
                $('#post-add-desc').val("");
                $(".modal-add-message").html('<div class="alert alert-success alert-dismissible">\
                <button type="button" class="close" data-dismiss="alert">&times;</button>\
                <strong>Whooa:</strong> Post Added Successfully\
              </div>')

            }
        }


    })
})

function get_posts(page) {
    $.getJSON('/get_posts', {
        page: page
    }, function (data) {
        $('.post-table').html(data.content)
        $(document).scrollTop(0)
        // console.log("data",data);

    })
}
$(document).on("click",".icon-delete-post", function () {
    var id = this.id;
    if (confirm("Are you sure.?")) {
        $.getJSON('/delete_post', {
            id: id
        }, function (data) {
            get_posts(1);

        })
    } else {

    }

})
$(document).on("click",".icon-edit-post", function () {
    var id = this.id;
    $.getJSON('/get_single_post', {
        id: id
    }, function (data) {
        data = data.content;
        $("#post-del-title").val(data.title);
        $("#post-del-desc").val(data.description);
        $("#post-del-link").val(data.link);
        $(".proj-create-button").attr("id",id);
        $("#post-edit-modal").modal("show")



    })
})
$(document).on("click",".proj-create-button",function(){
        let id = this.id; 
        let title = $("#post-del-title").val();
        let desc = $("#post-del-desc").val();
        let link = $("#post-del-link").val();
    $.getJSON('/update_post', {
        id: id,
        title:title,
        desc:desc,
        link:link
    }, function (data) {
if(data.content=="updated"){
                $(".modal-del-message").html('<div class="alert alert-success alert-dismissible">\
            <button type="button" class="close" data-dismiss="alert">&times;</button>\
            <strong>Whooa:</strong> Post Updated Successfully\
          </div>')
}

    })
})
$('#post-add-modal').on('hidden.bs.modal', function () {
    $(".modal-add-message").html("")
    get_posts(1).html("");
})
$('#post-edit-modal').on('hidden.bs.modal', function () {
    $(".modal-edit-message").html("")
    get_posts(1);
})