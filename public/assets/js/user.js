// - 为表单绑定提交事件，在事件处理函数中阻止表单默认提交的行为
// - 在事件处理函数中获取到用户在表单中输入的内容
// - 调用添加用户接口，将获取到的内容通过接口发送给服务器端
$('#userForm').on('submit', function () {
	var formData = $(this).serialize();
	$.ajax({
		type: "post",
		url: "/users",
		data: formData,
		success: function (response) {
			location.reload()
		},
		error: function (err) {
			var res = JSON.parse(err.responseText)
			alert(res.message)
		}

	});
	return false
});


// 为文件选择控件添加onchange事件，在事件处理函数中获取到用户选择到的文件
// 创建formData对象用于实现图片文件上传
// 调用图片文件上传接口，实现图片上传
// 在添加新用户表单中新增一个隐藏域，将图片地址存储在隐藏域中
$('#modifyBox').on('change', '#avatar', function () {
	var formData = new FormData()
	formData.append('avatar', this.files[0])
	$.ajax({
		type: "post",
		url: "/upload",
		data: formData,
		// dataType: "dataType",
		processData: false,
		contentType: false,
		success: function (response) {
			console.log(response);
			$('#preview').attr('src', response[0].avatar)
			$('#hiddenAvatar').val(response[0].avatar)

		}
	});
})


// 查询用户列表的接口文档，在页面加载时向服务器端发送Ajax请求，索要用户列表数据
// 使用模板引擎将数据和html模板进行拼接
// 将拼接好的内容展示在页面中
$.ajax({
	type: "get",
	url: "/users",
	success: function (response) {
		var html = template('userTpl', { data: response });
		$('#userBox').html(html);
	}
});

// 通过事件委托的形式为编辑按钮点击添加事件
// 在事件处理函数中获取到当前点击用户的id值
// 根据用户id获取用户的详细信息，并且通过模板引擎将用户的详细信息渲染到左侧的表单中
// 为修改按钮添加点击事件，在事件处理函数中获取到用户在表单中输入的内容，调用修改用户信息接口实现用户信息修改功能
$('#userBox').on('click', '.edit', function () {
	var id = $(this).attr('data-id')
	$.ajax({
		type: "get",
		url: "/users/" + id,
		success: function (response) {
			var html = template('modifyTpl', response)
			$('#modifyBox').html(html);
		}
	});
})
$('#modifyBox').on('submit', '#modifyForm', function () {
	var formData = $(this).serialize()
	var id = $(this).attr('data-id')
	$.ajax({
		type: "put",
		url: "/users/" + id,
		data: formData,
		success: function (response) {
			location.reload()
		}

	});
	return false
})


//	删除
$('#userBox').on('click', '.dele', function () {
	var id = $(this).attr('data')
	console.log(id);
	var isConfirm = confirm('您真的要删除吗?');
	if (isConfirm) {
		$.ajax({
			type: "delete",
			url: "/users/" + id,
			// data: "data",
			success: function (response) {
				// remove()
				location.reload()
			},
			error: function () {
				alert('删除失败')
			}

		});
	}

})