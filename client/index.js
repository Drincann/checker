// to be rendered element
const classesSwitcherBox = $('#classesSwitcherBox');
const queryBox = $('#queryBox');
const infoBox = $('#infoBox');

// actions element
const classesSwitcher = $('#classesSwitcher');
const queryButton = $('#queryButton');

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

async function queryAndRender(stuid) {
  try {
    const result = await axios.get(`/yqfx/search?studentid=${stuid}`);
    if (/已签到/.test(result?.data ?? '')) {
      queryBox.append(`<div href="#" class="list-group-item list-group-item-action list-group-item-success">${stuid}<br> ${result?.data}</div>`).slideDown()
    } else {
      queryBox.append(`<div href="#" class="list-group-item list-group-item-action list-group-item-danger">${stuid}<br> ${result?.data}</div>`).slideDown()
    }
  } catch (error) {
    queryBox.append(`<div href="#" class="list-group-item list-group-item-action list-group-item-dark">${stuid}<br> 请求出错</div>`)
  }
};

// query action
queryButton.on('click', async e => {
  if (queryBox.children().length >= 1) {
    await new Promise((resolve, reject) => {
      queryBox.children().slideUp(() => resolve(queryBox.html('')));
    });
  }
  try {
    await Promise.all(queryList.map(stuid => queryAndRender(stuid)))
  } catch (error) { /* ignore */ }
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