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
$(document).on("click", ".icon-delete-post", function () {
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
$(document).on("click", ".icon-edit-post", function () {
    var id = this.id;
    $.getJSON('/get_single_post', {
        id: id
    }, function (data) {
        data = data.content;
        $("#post-del-title").val(data.title);
        $("#post-del-desc").val(data.description);
        $("#post-del-link").val(data.link);
        $(".proj-edit-button").attr("id", id);
        $("#post-edit-modal").modal("show")



    })
})
$(document).on("click", '.btn-show-post', function () {
    let id = this.id;
    $.getJSON('/get_single_post', {
        id: id
    }, function (data) {
        data = data.content;
        var comments = data.comments;
        $("#post-show-title").val(data.title);
        $("#post-show-desc").val(data.description);
        $("#post-show-link").val(data.link);
        $(".btn-add-comment").attr("id", id);
       
        //    console.log(data.comments);

        var com_d = ""
         if(comments.length==0){
             
            $(".pos-comments-list").html('<a href="" class="list-group-item">No Comments</a>');
            // $(".pos-comments-list").html('<h3>No Comments</h3>')
         }
         else{
            for (var i of comments) {
                com_d += '<a href="" class="list-group-item">' + i.text + ": by user : <strong>" + i.user + '</strong></a>'
            }
            $(".pos-comments-list").html(com_d);
         }
       

        $('#post-show-modal').modal('show');



    })

})
$(document).on('click','.btn-add-comment',function(){
    var comment = $('#post-add-comment').val();
    
    if(!comment){
        alert("field should not be empty")
        return;
    }
    // alert(this.id)
    var id = this.id;
      $.getJSON('/create_comment', {
        post_id: id,
        comment : comment
    }, function (data) {
        console.log(data);
        
        $(".modal-show-message").html('<div class="alert alert-success alert-dismissible">\
        <button type="button" class="close" data-dismiss="alert">&times;</button>\
        <strong>Whooa:</strong> Comments Added Successfully\
      </div>')
      setTimeout(function(){ showcomments(id); }, 1000);
      
        
    //   console.log(data);
      
    })
})
$(document).on("click", ".proj-edit-button", function () {
    let id = this.id;
    let title = $("#post-del-title").val();
    let desc = $("#post-del-desc").val();
    let link = $("#post-del-link").val();
    $.getJSON('/update_post', {
        id: id,
        title: title,
        desc: desc,
        link: link
    }, function (data) {
        if (data.content == "updated") {
            $(".modal-edit-message").html('<div class="alert alert-success alert-dismissible">\
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
$('#post-show-modal').on('hidden.bs.modal', function () {
    $(".modal-edit-message").html("")
    get_posts(1);
})
function showcomments(id){
    $.getJSON('/get_single_post', {
        id: id
    }, function (data) {
        console.log(data);
        
        var comments = data.content.comments;
        var com_d = "";
        for (var i of comments) {
            com_d += '<a href="" class="list-group-item">' + i.text + ": by user : <strong>" + i.user + '</strong></a>'
        }
        $(".pos-comments-list").html(com_d);


    })
}