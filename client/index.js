// to be rendered element
const classesSwitcherBox = $('#classesSwitcherBox');
const queryBox = $('#queryBox');
const infoBox = $('#infoBox');

// actions element
const classesSwitcher = $('#classesSwitcher');
const queryButton = $('#queryButton');
const onlyDisplayNotChecked = $('#onlyDisplayNotChecked');

// list of student id array rendered under "global" scope
let queryList = [];

// render function
function renderDropdown(classes) {
  classesSwitcherBox.html(classes.map(classobj => `<button class="dropdown-item" type="button" data-classname="${classobj.name}">${classobj.name}</button>`).join('\n'))
}

function renderErrorInfo(infoMessage) {
  infoBox.html(`
      <div class="col-12 alert alert-danger" role="alert">
        ${infoMessage}
      </div>
      `);
}

async function query(stuid) {
  const result = await axios.get(`/yqfx/search?studentid=${stuid}`);
  if (/已签到/.test(result?.data ?? '')) {
    return { isChecked: true, content: result?.data };
  }
  return { isChecked: false, content: result?.data };

};

// query action
queryButton.on('click', async e => {
  if (queryBox.children().length >= 1) {
    await new Promise((resolve, reject) => {
      queryBox.children().stop().slideUp(() => {
        queryBox.html('');
        // resolve at next event loop which render is done
        setTimeout(resolve, 0);
      });
    });
  }
  try {
    await Promise.all(queryList.map(async stuid => {
      const queryEle = $(`<div href="#" class="list-group-item list-group-item-action list-group-item-default">${stuid} </div>`).appendTo(queryBox).stop().slideDown();

      try {
        const result = await query(stuid);
        if (result.isChecked) {
          queryEle.removeClass('list-group-item-default').addClass('list-group-item-success').html(`${stuid} <br> ${result?.content}`)
        } else {
          queryEle.removeClass('list-group-item-default').addClass('list-group-item-danger').html(`${stuid} <br> ${result?.content}`)
        }
      } catch (error) {
        renderErrorInfo(error.message)
        queryEle.removeClass('list-group-item-default').addClass('list-group-item-dark').html(`${stuid} <br> 请求失败`)
      }
    }));
    onlyDisplayNotChecked.trigger('change');
  } catch (error) { renderErrorInfo(error.message) }
});

// checked action
onlyDisplayNotChecked.on('change', e => {
  if (onlyDisplayNotChecked.prop('checked')) {
    queryBox.children('.list-group-item-success').stop().slideUp();
  } else {
    queryBox.children().stop().slideDown();
  }
});

// async dropdown render
(async () => {
  try {
    // dropdown data
    const config = (await axios.get('/config.json'))?.data;
    const classesArray = config?.classes;
    // data cache
    const classesMap = {}; config?.classes?.map?.(classobj => classesMap[classobj?.name] = classobj);
    // render dropdown
    renderDropdown(config.classes);
    // dropdown action
    classesSwitcherBox.on('click', e => {
      if (classesMap?.[$(e.target).data('classname')]) {
        queryList = classesMap[$(e.target).data('classname')]?.stuid;
        classesSwitcher.html($(e.target).data('classname'))
        $(e.target).siblings().removeClass('active');
        $(e.target).addClass().addClass('active');
      }
    });
    // render error message
  } catch (error) { renderErrorInfo(error.message); }
})()