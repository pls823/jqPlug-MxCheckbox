/*
* @name: MxCheckbox插件
* @author: pls
* @update: 2019-1-23
* @descript:
* 插件为单选，多选组件框。
* 插件使用js原生代码
* 插件提供:init,setValue,getValue,getData,clear,checkRequired 6个方法
*
MxCheckbox.init({
id: 'demo', //插件id
width: "", //插件宽，可以不设置，css有最小值，以及自适应父级宽度
height: "", //插件高，可以不设置，css有最小值，以及自适应子元素高度
labelWidth: 80, //插件左边label宽度，可以不设置，默认值80，textalign为左
data: [{
  key: "sku1",
  keyLabel: "sku1英文",
  multiple: true,    //插件默认为false，单选
  required: true,   //必选，默认值false
  onSelect: function (data) {
  },
  data: [{
    text: "尺寸",
    value: "size"
  },{
    text: "尺寸备注",
    value: "size1"
  },]
}, {
  key: "sku2",
  keyLabel: "sku1英文",
  data: [{
    text: "尺寸备注",
    value: "size"
  }, {
    text: "尺寸1",
    value: "size1"
  },]
}],
});
MxCheckbox.setValue("demo", [
{key: "sku2", value: "size,size1"},
{key: "sku1", value: "size"}]
);
MxCheckbox.getValue("demo", "sku2")
MxCheckbox.getData("demo")
MxCheckbox.clear("demo")
MxCheckbox.checkRequired("demo")
*
* */
;(function () {
    //创建插件对象
    var MxCheckbox = {};
    //创建插件对象的集合
    var map = {};

    //创建插件的工厂对象
    function createCheckbox(option) {
        var vm = this;
        //浅拷贝传入值，以及设置默认值
        vm.$options = Object.assign({
            id: 'demo', //插件id
            width: "", //插件宽，可以不设置，css有最小值，以及自适应父级宽度
            height: "", //插件高，可以不设置，css有最小值，以及自适应子元素高度
            labelWidth: 80, //插件左边label宽度，默认值80，textalign为左
            data: [], //插件数据
        }, option);
        vm.$options.checkboxId = vm.$options.id + "_MxCheckbox";
        //初始化
        vm.init = function () {
            //创建插件外框
            vm.createBox();

            if (vm.$options.data.length == 0) {
                return
            }

            //创建插件组内分组
            vm.$options.data.forEach(function (data) {
                vm.createLi(data, "");
            });

        };

        //创建插件外框
        vm.createBox = function () {
            var parentNode = document.getElementById(vm.$options.id);
            var mxCheckBox = document.createElement("div");
            var ul = document.createElement("ul");
            mxCheckBox.id = vm.$options.checkboxId;
            mxCheckBox.className = "mxCheckBox";
            if (!!vm.$options.width) {
                mxCheckBox.style.width = vm.$options.width + "px";
            }
            if (!!vm.$options.height) {
                mxCheckBox.style.height = vm.$options.height + "px";
            }

            if (vm.$options.add) {
                var addGroupBox = document.createElement("a");
                var icoNode = document.createElement("i");
                var textNode = document.createTextNode("SKU选项缺失？点我新增");
                addGroupBox.className = "addGroup";
                addGroupBox.appendChild(icoNode);
                addGroupBox.appendChild(textNode);
                mxCheckBox.appendChild(addGroupBox);

                addGroupBox.onclick = function () {
                    vm.createAddGroupBox(vm.$options);
                };
            }
            mxCheckBox.appendChild(ul);
            parentNode.appendChild(mxCheckBox);
        };
        //创建增加组弹出框
        vm.createAddGroupBox = function (data) {
            var addGroupBox = document.createElement("div");
            var ul = document.createElement("ul");
            var liheader = document.createElement("li");
            var liLable = document.createElement("li");
            var liValue = document.createElement("li");
            var libutton = document.createElement("li");
            var spanLable = document.createElement("span");
            var spanValue = document.createElement("span");
            var spanInput = document.createElement("input");
            var valueInput = document.createElement("input");
            var buttonSure = document.createElement("button");
            var buttonCancel = document.createElement("button");
            var headerNode = document.createTextNode("新增SKU选项");
            var labelNode = document.createTextNode("选项名称");
            var valueNode = document.createTextNode("选项值");
            var sureNode = document.createTextNode("确定");
            var cancelNode = document.createTextNode("取消");

            addGroupBox.className = "addGroupBox";
            liLable.className = "groupLable";
            liValue.className = "groupValue";
            libutton.className = "button";

            spanLable.appendChild(labelNode);
            liheader.appendChild(headerNode);
            liLable.appendChild(spanLable);
            liLable.appendChild(spanInput);

            spanValue.appendChild(valueNode);
            liValue.appendChild(spanValue);
            liValue.appendChild(valueInput);

            buttonSure.appendChild(sureNode);
            buttonCancel.appendChild(cancelNode);
            libutton.appendChild(buttonSure);
            libutton.appendChild(buttonCancel);

            ul.appendChild(liheader);
            ul.appendChild(liLable);
            ul.appendChild(liValue);
            ul.appendChild(libutton);

            addGroupBox.appendChild(ul);

            /*   html结构如下
                 var addGroupBox = "<div class='addGroupBox'>" +
                                     "<ul>" +
                                      "<li class='groupLable'><span>文本</span><input type='text'></li>"   +
                                      "<li class='groupValue'><span>值</span><input type='text'></li>"   +
                                      "<li class='groupRequired'><span>是否必选</span>" +
                                     "<label><input type='radio' name='required' value='0'>否</label>>"   +
                                     "<label><input type='radio' name='required' value='1'>是</label></li>"   +
                                      "<li class='button'><button>确定</button><button>取消</button></li>"   +
                                     "</ul></div>";*/

            var mxCheckBox = document.querySelector("#" + vm.$options.id + " .mxCheckBox");
            mxCheckBox.appendChild(addGroupBox);

            buttonCancel.onclick = function () {
                mxCheckBox.removeChild(addGroupBox);
            };
            buttonSure.onclick = function () {
                //获取值
                var text = document.querySelector(".mxCheckBox .addGroupBox .groupLable input").value;
                var value = document.querySelector(".mxCheckBox .addGroupBox .groupValue input").value;
                //判断是否重复
                var more = false;
                vm.$options.data.forEach(function (data) {
                    if (data.keyLabel == text) {
                        more = true;
                    }
                });

                if (more == true) {
                    vm.creatAlert("【" + text + "】重复，请您重新输入。");
                    document.querySelector(".mxCheckBox .addGroupBox .groupLable input").value = "";
                    return
                }
                if (text == "" || text == " ") {
                    vm.creatAlert("【选项名称】为空，请您输入值。");
                    return
                }
                var d = {
                    key: text,
                    keyLabel: text,
                    required: true,
                    add: true,
                    data: [{
                        text: value,
                        value: ""
                    }]
                };

                data.data.push(d);
                vm.createLi(d, "remove");
                //移除创建框
                mxCheckBox.removeChild(addGroupBox);
            };
        };
        //创建alert弹框
        vm.creatAlert = function (msg) {
            var addGroupBox = document.createElement("div");
            var ul = document.createElement("ul");
            var liheader = document.createElement("li");
            var liLable = document.createElement("li");
            var libutton = document.createElement("li");
            var spanLable = document.createElement("span");
            var buttonSure = document.createElement("button");
            var headerNode = document.createTextNode("提示");
            var labelNode = document.createTextNode(msg);
            var sureNode = document.createTextNode("确定");

            addGroupBox.className = "mxCheckboxAlert";
            liLable.className = "groupLable";
            libutton.className = "button";

            spanLable.appendChild(labelNode);
            liheader.appendChild(headerNode);
            liLable.appendChild(spanLable);

            buttonSure.appendChild(sureNode);
            libutton.appendChild(buttonSure);

            ul.appendChild(liheader);
            ul.appendChild(liLable);
            ul.appendChild(libutton);

            addGroupBox.appendChild(ul);

            var mxCheckBox = document.querySelector("#" + vm.$options.id + " .mxCheckBox");
            mxCheckBox.appendChild(addGroupBox);

            buttonSure.onclick = function () {
                //移除创建框
                mxCheckBox.removeChild(addGroupBox);
            };
        };
        //创建插件组内分组
        vm.createLi = function (data, remove) {
            var ul = document.querySelector("#" + vm.$options.id + " ul");
            var li = document.createElement("li");
            var label = document.createElement("div");
            var labelText = document.createTextNode(data.keyLabel);
            var checkData = document.createElement("div");

            checkData.className = "checkData";
            checkData.setAttribute("mxKey", data.key);
            //全部为必选
            data.required = true;
            label.className = data.required == true || data.required == "true" ? "label required" : "label";

            if (!!vm.$options.labelWidth) {
                label.style.width = vm.$options.labelWidth + "px";
            }
            label.appendChild(labelText);

            li.appendChild(label);
            li.appendChild(checkData);

            li.setAttribute("mxKey", data.key);
            ul.appendChild(li);

            var d = data.data || [];

            if (d.length !== 0 && remove !== "remove") {
                d.forEach(function (t) {
                    vm.createSpan(checkData, t, data);
                });
            }

            if (!!data.add) {
                var t = {text: "", value: ""};
                var checkSpan = document.createElement("span");
                var checkInput = document.createElement("input");
                var checkDefalt = document.createElement("input");
                var checkLabel = document.createElement("label");
                var defaultNode = document.createTextNode("默认");

                checkInput.setAttribute("type", "text");
                checkInput.setAttribute("mxValue", t.text);
                checkInput.setAttribute("mxKey", data.key);

                checkDefalt.setAttribute("type", "checkbox");
                checkDefalt.className = "mxCheckbox";

                checkLabel.appendChild(checkDefalt);
                checkLabel.appendChild(defaultNode);

                checkSpan.appendChild(checkInput);
                checkSpan.appendChild(checkLabel);

                checkData.appendChild(checkSpan);
                checkSpan.setAttribute("mxValue", "");
                checkSpan.setAttribute("mxKey", "addSpan");


                checkInput.readOnly = true;
                checkDefalt.onclick = function () {
                    checkInput.onfocus();
                    if (checkInput.readOnly == true) {
                        checkDefalt.checked = false;
                        return
                    }

                    if (checkDefalt.checked == true) {
                        checkInput.value = "默认";

                    } else {
                        checkInput.value = "";
                    }
                };

                checkInput.oninput = function (el) {
                    var that = this;
                    vm.$options.data.forEach(function (t, index) {
                        if (t.key == that.getAttribute("mxkey")) {
                            vm.$options.data[index].text = that.value;
                        }
                    });
                    that.setAttribute("mxvalue", that.value);
                };
                checkInput.onblur = function () {
                    if (checkDefalt.checked == true) {
                        checkDefalt.checked = false;
                    }
                    var that = this;
                    var text = that.value;
                    var data = d || [];
                    data.forEach(function (t, index) {
                        if (t.text == text) {
                            vm.creatAlert("【" + text + "】重复，请您重新输入。");
                            that.value = "";
                        }
                    });
                    vm.$options.data.forEach(function (t, index) {
                        if (t.key == that.getAttribute("mxkey")) {
                            vm.$options.data[index].text = that.value;
                        }
                    });
                    that.setAttribute("mxvalue", that.value);
                };
                checkInput.onfocus = function () {
                    var $el = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + data.key + "'] .checkData .checked");

                    if ($el.length > 0) {
                        checkInput.readOnly = true;
                    } else {
                        checkInput.readOnly = false;
                    }
                };

                if (remove == "remove") {
                    var remove = document.createElement("i");
                    checkInput.value = data.data[0].text;

                    remove.className = "iconfont icon-delete";
                    remove.onclick = function () {
                        vm.$options.data.forEach(function (t, index) {
                            if (t.key == checkInput.getAttribute("mxkey")) {
                                vm.$options.data.splice(index, 1)
                            }
                        });
                        ul.removeChild(li);
                    };

                    checkData.appendChild(remove);
                }

            }


        };
        //创建插件分组内数据
        vm.createSpan = function (el, data, parentData) {
            var $checkData = el;
            var checkSpan = document.createElement("span");
            var checkTextNode = document.createTextNode(data.text);

            checkSpan.appendChild(checkTextNode);
            checkSpan.setAttribute("mxValue", data.value);
            checkSpan.setAttribute("mxKey", parentData.key);
            data['from'] = data['from'] || [];
            checkSpan.setAttribute("from", data['from'].join(","));
            $checkData.appendChild(checkSpan);

            checkSpan.onclick = function () {
                var $span = this;

                //判断input框是否有值
                if (!!parentData.add) {
                    var addSpan = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + parentData.key + "'] [mxkey='addSpan'] input[type='text']")[0];
                    var addSpanValue = addSpan.value;

                    if (addSpanValue.length > 0) {
                        return
                    }
                }

                if ($span.className == "disable") {
                    return
                }

                var checked = false; //判断是否被选中

                if ($span.className == "checked") {
                    $span.className = "";
                    checked = true; //判断为被选中，取消选中状态，不执行选中操作
                }

                if (!checked) {
                    var $el = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + parentData.key + "'] .checkData span");
                    var length = $el.length;

                    for (var i = 0; i < length; i++) {
                        $el[i].className = $el[i].className == "disable" ? "disable" : "";
                    }

                }

                var all = document.querySelectorAll("#" + vm.$options.id + " .checkData span[from]");
                //判断是否禁用
                var isCheck = false;
                all.forEach(function (t) {
                    if (t.className == "checked") {
                        isCheck = true;
                    }
                });

                if (!isCheck) {
                    var from = $span.getAttribute("from");
                    all.forEach(function (t) {
                        var fromList = t.getAttribute("from");
                        var spanFrom = from.split(",") || [];
                        var match = false;
                        spanFrom.forEach(function (f) {
                            if (fromList.indexOf(f) > -1) {
                                match = true
                            }
                        });
                        if (match) {
                            t.className = t.className == "checked" ? "checked" : "";
                        } else {
                            t.className = "disable";
                        }
                    });
                }

                if (!checked) {
                    $span.className = "checked";
                } else {
                    $span.className = "";
                    if (!isCheck) {
                        all.forEach(function (t) {
                            if (t.className == "disable") {
                                t.className = "";
                            }
                        });
                    }
                }

                if (typeof parentData.onSelect == "function") {
                    var allData = vm.getData(vm.$options.id);
                    parentData.onSelect(allData, {
                        key: parentData.key,
                        keyLabel: parentData.keyLabel,
                        value: $span.getAttribute("mxvalue"),
                        text: $span.innerText
                    });
                }

            }
        };
        //设置插件默认值方法
        vm.setValue = function (el, data) {
            var data = data;
            if (typeof data == 'string') {
                alert("请传入数组结构")
                return
            }

            data.forEach(function (d) {
                var key = d.key;
                var value = d.value;

                if (typeof value == "string") {
                    value = value.split(",")
                }

                value.forEach(function (t) {
                    var tt = t;
                    vm.$options.data.forEach(function (data) {
                        if (key == data.keyLabel) {
                            key = data.key;

                            var spanData = data.data || [];
                            spanData.forEach(function (arr) {
                                if (value == arr.text) {
                                    tt = arr.value;
                                }
                            });
                        }
                    });
                    var $el = document.querySelector("#" + el + " [mxkey='" + key + "'] .checkData [mxvalue='" + tt + "']");
                    if ($el !== null) {
                        $el.className = "checked";
                    }
                });
            });
        };
        //获取插件组内选中值
        vm.getValue = function (el, key) {
            var $el = document.querySelectorAll("#" + el + " [mxkey='" + key + "'] .checkData .checked");
            var length = $el.length;
            var arr = [];

            if (length == 0) {
                var $el = document.querySelectorAll("#" + el + " [mxkey='" + key + "'] input[type='text']");
                var value = "";
                var text = "";

                if ($el.length > 0) {
                    value = "";
                    text = $el[0].value;
                }

                arr.push({
                    value: value,
                    text: text
                });

                return arr
            }

            for (var i = 0; i < length; i++) {
                var value = $el[i].getAttribute("mxvalue");
                var text = $el[i].innerText;
                arr.push({
                    value: value,
                    text: text
                })
            }

            return arr
        };
        //获取插件所有选中值
        vm.getData = function (el) {
            var $el = document.querySelectorAll("#" + el + " li");
            var length = $el.length;
            var arr = [];

            for (var i = 0; i < length; i++) {
                var mxkey = $el[i].getAttribute("mxkey");
                var data = vm.getValue(el, mxkey);
                var value = "";
                var text = "";
                var keyLabel = "";

                data.forEach(function (t, index) {
                    value = value + t.value + (data.length == index + 1 ? "" : ",");
                    text = text + t.text + (data.length == index + 1 ? "" : ",");
                });

                vm.$options.data.forEach(function (t) {
                    if (t.key == mxkey) {
                        keyLabel = t.keyLabel;
                    }
                });

                if (mxkey == "labelAdd") {
                    continue
                }
                arr.push({
                    key: mxkey,
                    keyLabel: keyLabel,
                    value: value,
                    text: text
                })
            }
            ;
            return arr
        };
        //清空插件所有选中值
        vm.clear = function (el) {
            var $el = document.querySelectorAll("#" + el + " .checkData span");
            var length = $el.length;

            for (var i = 0; i < length; i++) {
                $el[i].className = "";
            }
            var spaninput = document.querySelectorAll("#" + el + " .checkData [mxkey='addSpan'] input[type='text']");
            var spanCheckbox = document.querySelectorAll("#" + el + " .checkData [mxkey='addSpan'] input[type='checkbox']");

            for (var i = 0; i < spaninput.length; i++) {
                spaninput[i].value = "";
                spaninput[i].setAttribute("mxvalue", "");
                spanCheckbox[i].checked = false;
            }
        };

        //检查必选
        vm.checkRequired = function (el) {
            var data = vm.getData(el);
            var text = "";
            vm.$options.data.forEach(function (t) {
                data.forEach(function (d) {
                    if (t.key == d.key && (t.required == true || t.required == "true")) {
                        text = text + (d.text == "" ? t.keyLabel + "的值为必选。" : "");
                    }
                })
            });
            return text
        };

        //销毁插件
        vm.destroy = function (el) {
            delete map[el];
            var child = document.querySelectorAll("#" + el + " #" + el + "_MxCheckbox")[0];
            document.querySelectorAll("#" + el)[0].removeChild(child);
        };
    }

    //初始化插件
    MxCheckbox.init = function (data) {
        if (!data || Object.keys(data).length == 0) {
            alert("请您传入配置数据。");
            return
        }

        var parentNode = document.querySelector("#" + data.id);
        if (!parentNode) {
            alert("未找到插件挂载元素。");
            return
        }

        if (!map[data.id]) {
            map[data.id] = new createCheckbox(data);
            map[data.id].init();
        } else {
            alert("您已经创建过相同id的插件。")
        }
    };
    //设置插件选中值
    MxCheckbox.setValue = function (el, data) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        map[el].setValue(el, data);
    };
    //获取插件组内数据的选中值
    MxCheckbox.getValue = function (el, key) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。");
            return
        }
        return map[el].getValue(el, key);
    };
    //获取插件全部选中值
    MxCheckbox.getData = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].getData(el);
    };
    //清除插件的选中值
    MxCheckbox.clear = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].clear(el);
    };
    //检查必选
    MxCheckbox.checkRequired = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].checkRequired(el);
    };
    //销毁插件
    MxCheckbox.destroy = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        map[el].destroy(el);
    };
    //插件外抛
    window.MxCheckbox = MxCheckbox;
})();
