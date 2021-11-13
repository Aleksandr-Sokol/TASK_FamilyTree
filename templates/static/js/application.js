$(document).ready(function() {

    function get_countries(){
        let url = 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json';
        let country_dict;
        $.ajax({
	       type: 'GET',
	       url: url,
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 country_dict =  JSON.parse(data)
	       }
	    });
	    return country_dict;
    }

    function get_person_by_gender(G){
        data = {}
        if (G != 'None')
            data = { 'gender': G}
        let url = '/person';
        let person_dict;
        $.ajax({
	       type: 'GET',
	       url: url,
	       data: jQuery.param(data) ,
           async: false,
	       processData: false,  // tell jQuery not to process the data
           contentType: false,  // tell jQuery not to set contentType
	       success: function(data, status){
                 person_dict =  data
	       }
	    });
	    return person_dict;
    }

    console.log('start Application')

    // закрытии модального окна
    $(document).on('click', '.modal_close_window', function (e) {
        $(this).parent().parent().parent().parent().hide()
    })

    //    Открытие окна добавление человека
    $(document).on('click', '.person', function () {
        // Список доступных стран городов
        let country_dict = get_countries();
        let sity_dict;
        let birthplace_country_select = document.getElementById('birthplace_country_select');
        let birthplace_sity_select = document.getElementById('birthplace_sity_select');
        let person_father_select = document.getElementById('person_father_select');
        let person_mother_select = document.getElementById('person_mother_select');
        let person_current_spouse_select = document.getElementById('person_current_spouse_select');
        // Очистка при повторном открытии окна
        $("#birthplace_country_select").empty();
        $("#birthplace_sity_select").empty();
        $("#person_father_select").empty();
        let opt = document.createElement('option');
        opt.value = -1;
        opt.innerHTML = 'Unknown';
        person_father_select.appendChild(opt);
        $("#person_mother_select").empty();
        let opt1 = document.createElement('option');
        opt1.value = -1;
        opt1.innerHTML = 'Unknown';
        person_mother_select.appendChild(opt1);
        let opt2 = document.createElement('option');
        opt2.value = -1;
        opt2.innerHTML = 'Unknown';
        person_current_spouse_select.appendChild(opt2);
        //	    Заполнить список стран
        Object.entries(country_dict).forEach(([key, value]) => {
            let opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = key;
            birthplace_country_select.appendChild(opt);
        });
        sity_dict = country_dict["Russia"]
        for (let i = 0; i < sity_dict.length; i++) {
            let opt = document.createElement('option');
            opt.value = sity_dict[i];
            opt.innerHTML = sity_dict[i];
            birthplace_sity_select.appendChild(opt);
        }
        //        Сделать Russia активной по умолчанию
        $('option[value="Russia"]').attr('selected', 'selected').parent().focus();
        $('option[value="Perm"]').attr('selected', 'selected').parent().focus();
        // Люди мужского пола
        let mans = get_person_by_gender('M')
        for (let i = 0; i < mans.length; i++) {
            let opt = document.createElement('option');
            opt.value = mans[i]['id'];
            opt.innerHTML = mans[i]['family'] + ' ' + mans[i]['name'];
            person_father_select.appendChild(opt);
        }
        // Люди женского пола
        let womens = get_person_by_gender('F')
        for (let i = 0; i < womens.length; i++) {
            let opt = document.createElement('option');
            opt.value = womens[i]['id'];
            opt.innerHTML = womens[i]['family'] + ' ' + womens[i]['name'];
            person_mother_select.appendChild(opt);
        }
        // Все Люди
        let peoples = get_person_by_gender('None')
        for (let i = 0; i < peoples.length; i++) {
            let opt = document.createElement('option');
            opt.value = peoples[i]['id'];
            opt.innerHTML = peoples[i]['family'] + ' ' + peoples[i]['name'];
            person_current_spouse_select.appendChild(opt);
        }
        //        Открыть модальное окно
        $('#Person_modal').toggle();
    })

    // Действие при нажатии на кнопку в окне создания человека
    $(document).on('click', '#person_ok_window', function () {
        let family = $($('#Person_modal').find('.person_family')[0]).val()
        let name = $($('#Person_modal').find('.person_name')[0]).val()
        let midlename = $($('#Person_midlename').find('.person_midlename')[0]).val()
        let gender = $('#person_gender').find(":selected").val()
        let country = $('#birthplace_country_select').find(":selected").val();
        let sity = $('#birthplace_sity_select').find(":selected").val();
        let father_id = $('#person_father_select').find(":selected").val();
        if (!!!father_id)
            father_id = '-1'
        let mother_id = $('#person_mother_select').find(":selected").val();
        if (!!!mother_id)
            mother_id = '-1'
        let spouse_id = $('#person_current_spouse_select').find(":selected").val();
        if (!!!spouse_id)
            spouse_id = '-1'

        let json_table = {
            'family': family,
            'name': name,
            'gender': gender,
            'midlename': midlename,
            "mother_num": mother_id,
            "father_num": father_id,
            "spouse_num": spouse_id,
            'position': {'country': country,
                         'sity': sity,
                         },
        }
        console.log(JSON.stringify(json_table))
        $.ajax({
	      headers: {
	        'Content-Type': 'application/json',
//	        "Authorization": "Basic " + btoa('alexander' + ":" + '123')
	      },
	      type: 'POST',
	      url: '/person',
	      data: JSON.stringify(json_table),
	       dataType: 'json',
	      success: function(data, status){
                $('#Person_modal').toggle();
	      }
	    });

    })

})