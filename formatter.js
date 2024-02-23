var subgroup = 0;
var subAdd = 0;

$(document).ready(function () {
  onChangedMain();
});

function onAdd(value, subA) {
  ++subAdd;
  console.log(value);
  console.log($("#main-dropdown").val());
  var sectionAdd = `<div class="sub-add" id="subAdddiv${subAdd}">`;
  sectionAdd += `<select class="rule-col" id="colvalue${subAdd}">`;
  sectionAdd += `<option value="ID" selected>ID</option>`;
  sectionAdd += `<option value="Name" >Name</option></select>`;
  sectionAdd += `<select class="rule-dropdown"id="operatores${subAdd}">`;
  sectionAdd += `<option value="=">=</option>`;
  sectionAdd += `<option value="!=">!=</option>`;
  sectionAdd += `<option value=">">></option>`;
  sectionAdd += `<option value="<"><</option>`;
  sectionAdd += `<option value="=<">=<</option>`;
  sectionAdd += `<option value=">=">>=</option>`;
  sectionAdd += `<option value="contians">contians</option>`;
  sectionAdd += `<option value="beginsWith">Begins with</option>`;
  sectionAdd += `<option value="endsWith">Ends with</option>`;
  sectionAdd += `<option value="doesNotContain">does not contian</option>`;
  sectionAdd += `<option value="doesNotBeginWith">does begin with</option>`;
  sectionAdd += `<option value="doesNotEndWith">does not begin with</option>`;
  sectionAdd += `<option value="null">is null</option>`;
  sectionAdd += `<option value="notNull">is not null</option>`;
  sectionAdd += `<option value="in">in</option>`;
  sectionAdd += `<option value="notIn">not in</option>`;
  sectionAdd += `</select>`;
  sectionAdd += `<input id="value-editor${subAdd}" class="rule-text" type="text" placeholder class="rule-value" ></input>`;
  sectionAdd += `<button onClick="removeAdd(subAdddiv${subAdd})">X</button>`;
  sectionAdd += `</div>`;
  if (subA) {
    $(`#sub-Section${subA}`).append(sectionAdd);
  } else {
    $("#dy-form").append(sectionAdd);
  }
  onChangeAddSection();
  onChangesValues();
  QueryFormatter();
}

function onGroup(value, subG) {
  ++subgroup;
  console.log(value);
  console.log($("#main-dropdown").val());
  var sectionGroup = `<div class="sub-group" id="subGroupdiv${subgroup}"><div class="sub-group-form">`;
  sectionGroup += `<select class="sub-dropdown-class" id="sub-dropdown${subgroup}">"
                     onchange="onCondition(this.value)">
                    <option value="and">And</option>
                    <option value="or">Or</option>
                    </select>`;
  sectionGroup += ` <button id="subadd${subgroup}" onclick="onAdd(this.id,${subgroup})">+ Add</button>`;
  sectionGroup += `<button id="subgroup${subgroup}" onclick="onGroup(this.id,${subgroup})" disabled>+ Group</button>`;
  sectionGroup += `<button class="removeGroup" onClick="removeGroup(subGroupdiv${subgroup})">X</button></div>`;
  sectionGroup += `<div id="sub-Section${subgroup}" class="sub-group" ></div></div>`;
  if (subG) {
    $(`#sub-section-add${subG}`).append(sectionGroup);
  } else {
    $("#dy-form").append(sectionGroup);
  }
  QueryFormatter();
}

function removeAdd(element) {
  $(`#${element.id}`).remove();
  QueryFormatter();
}
function removeGroup(element) {
  $(`#${element.id}`).remove();
}

function onChangeAddSection() {
  $(".rule-dropdown").on("change", function () {
    let dropdownId = this.id;
    let textBoxId = $(this).next().attr("id");

    // isNull and NotNull changes
    if (
      $(`#${dropdownId}`).val() == "isnull" ||
      $(`#${dropdownId}`).val() == "isNotNull"
    ) {
      $(`#${textBoxId}`).hide();
    } else {
      $(`#${textBoxId}`).show();
    }
  });
  $(".rule-value").on("keypress", function () {
    let textBoxId = this.id;
  });
  $(".rule-col").on("change", function () {
    let textBoxId = this.id;
  });
}

function onChangedMain() {
  $("#dy-form").on("DOMSubtreeModified", function () {});
}
function onCondition(intialValue) {
  console.log("changed Intial Value" + intialValue);
  QueryFormatter();
}

function QueryFormatter() {
  $("#sql-formatted").empty("");
  var realQuery = `( `;
  $("#dy-form")
    .children()
    .each(function (index, element) {
      console.log($(element).attr("id"), $(element).attr("class"), index);
      if ($(element).attr("class") == "sub-add") {
        if (index >= 1) {
          realQuery += `${$("#main-dropdown").val()}`;
        }
        let query_value = $(element).attr("id").split("").pop();
        var value_query = $(`#colvalue${query_value}`).val();
        var opertor_query = $(`#operatores${query_value}`).val();
        var valCond_query = $(`#value-editor${query_value}`).val();
        realQuery += ` ${value_query} ${opertor_query} '${valCond_query}' `;
      }
      //drop coulumn. colvalue1
      //condition operatores1
      //text Box value-editor1

      if ($(element).attr("class") == "sub-group") {
        let subGroup_query = $(element).attr("id").split("").pop();
        realQuery += ` (`;
        $("#sub-Section" + $(element).attr("id").split("").pop())
          .children()
          .each(function (index, element) {
            console.log($(element).attr("id"), $(element).attr("class"));

            if ($(element).attr("class") == "sub-add") {
              if (index >= 1) {
                realQuery += `${$("#sub-dropdown" + subGroup_query).val()}`;
              }
              let query_value = $(element).attr("id").split("").pop();
              var value_query = $(`#colvalue${query_value}`).val();
              var opertor_query = $(`#operatores${query_value}`).val();
              var valCond_query = $(`#value-editor${query_value}`).val();
              realQuery += ` ${value_query} ${opertor_query} '${valCond_query}' `;
            }
          });
        realQuery += ` ) `;
      }
    });

  realQuery += ` )`;
  $("#sql-formatted").append(realQuery);
}

function onChangesValues() {
  $(".rule-text").on("keyup", function () {
    QueryFormatter();
  });

  $(".rule-dropdown").on("change", function () {
    QueryFormatter();
  });
  $(".rule-col").on("change", function () {
    QueryFormatter();
  });
  $(".sub-dropdown-class").on("change", function () {
    QueryFormatter();
  });
}
//   if(){
// $("#json-formatted").append(JSON.stringify(realJSONFormatter));
//   }
// var realJSONFormatter = {
//     rules: [],
//     combinator: "and",
//   };
