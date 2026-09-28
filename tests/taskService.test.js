// const taskService = require('../src/services/taskService');

// beforeEach(() => {
//   taskService._reset();
// });

// describe('taskService.create', () => {
//   test('should create a task with default values', () => {
//     const task = taskService.create({
//       title: 'Test task'
//     });

//     expect(task).toHaveProperty('id');
//     expect(task.title).toBe('Test task');
//     expect(task.description).toBe('');
//     expect(task.status).toBe('todo');
//     expect(task.priority).toBe('medium');
//     expect(task.dueDate).toBeNull();
//     expect(task.completedAt).toBeNull();
//     expect(task).toHaveProperty('createdAt');
//   });
// });

// describe('taskService.findById', () => {
//   test('should find a task by ID', () => {
//     const createdTask = taskService.create({
//       title: 'Find me'
//     });

//     const task = taskService.findById(createdTask.id);

//     expect(task).toEqual(createdTask);
//   });

//   test('should return undefined for unknown ID', () => {
//     const task = taskService.findById('unknown-id');

//     expect(task).toBeUndefined();
//   });
// });

// describe('taskService.update', () => {
//   test('should update an existing task', () => {
//     const createdTask = taskService.create({
//       title: 'Old title'
//     });

//     const updatedTask = taskService.update(
//       createdTask.id,
//       {
//         title: 'New title'
//       }
//     );

//     expect(updatedTask.title).toBe('New title');
//     expect(updatedTask.id).toBe(createdTask.id);
//   });

//   test('should return null for unknown ID', () => {
//     const result = taskService.update(
//       'unknown-id',
//       {
//         title: 'New title'
//       }
//     );

//     expect(result).toBeNull();
//   });
// });

// describe('taskService.remove', () => {
//   test('should remove an existing task', () => {
//     const task = taskService.create({
//       title: 'Delete me'
//     });

//     const result = taskService.remove(task.id);

//     expect(result).toBe(true);
//     expect(taskService.findById(task.id)).toBeUndefined();
//   });

//   test('should return false for unknown ID', () => {
//     const result = taskService.remove('unknown-id');

//     expect(result).toBe(false);
//   });
// });

// describe('taskService.completeTask', () => {
//   test('should complete an existing task', () => {
//     const task = taskService.create({
//       title: 'Complete me',
//       priority: 'high'
//     });

//     const completedTask = taskService.completeTask(task.id);

//     expect(completedTask.status).toBe('done');
//     expect(completedTask.priority).toBe('high');
//     expect(completedTask.completedAt).not.toBeNull();
//   });

//   test('should return null for unknown ID', () => {
//     const result = taskService.completeTask('unknown-id');

//     expect(result).toBeNull();
//   });
// });





// taskService ko import kar rahe hain.
// Is file mein task create, find, update, delete,
// complete jaise business logic functions hain.
const taskService = require('../src/services/taskService');


// Har test start hone se pehle ye chalega.
// Isse previous test ka data remove ho jayega.
// Har test independent rahega.
beforeEach(() => {
  taskService._reset();
});


// ============================================================
// 1. taskService.create()
// ============================================================

describe('taskService.create', () => {

  test('should create a task with default values', () => {

    // Task create kar rahe hain.
    // Sirf title diya hai.
    const task = taskService.create({
      title: 'Test task'
    });


    // Task ke paas automatically ID honi chahiye.
    expect(task).toHaveProperty('id');


    // Title wahi hona chahiye jo humne diya.
    expect(task.title).toBe('Test task');


    // Description nahi diya,
    // isliye default description empty string honi chahiye.
    expect(task.description).toBe('');


    // Status nahi diya,
    // isliye default status "todo" hona chahiye.
    expect(task.status).toBe('todo');


    // Priority nahi diya,
    // isliye default priority "medium" honi chahiye.
    expect(task.priority).toBe('medium');


    // Due date nahi diya,
    // isliye default value null honi chahiye.
    expect(task.dueDate).toBeNull();


    // New task abhi complete nahi hua,
    // isliye completedAt null hona chahiye.
    expect(task.completedAt).toBeNull();


    // Task create hone ka time automatically generate hona chahiye.
    expect(task).toHaveProperty('createdAt');
  });

});


// ============================================================
// 2. taskService.findById()
// ============================================================

describe('taskService.findById', () => {

  test('should find a task by ID', () => {

    // Pehle ek task create karte hain.
    const createdTask = taskService.create({
      title: 'Find me'
    });


    // Ab us task ki ID use karke task find kar rahe hain.
    const task = taskService.findById(createdTask.id);


    // Jo task create kiya tha,
    // wahi task return hona chahiye.
    expect(task).toEqual(createdTask);
  });


  test('should return undefined for unknown ID', () => {

    // Aisi ID search kar rahe hain jo exist nahi karti.
    const task = taskService.findById('unknown-id');


    // Task nahi milega,
    // isliye result undefined hona chahiye.
    expect(task).toBeUndefined();
  });

});


// ============================================================
// 3. taskService.update()
// ============================================================

describe('taskService.update', () => {

  test('should update an existing task', () => {

    // Pehle ek task create karte hain.
    const createdTask = taskService.create({
      title: 'Old title'
    });


    // Existing task ko update kar rahe hain.
    const updatedTask = taskService.update(
      createdTask.id,
      {
        title: 'New title'
      }
    );


    // Title update hona chahiye.
    expect(updatedTask.title).toBe('New title');


    // Task ki ID same rehni chahiye.
    expect(updatedTask.id).toBe(createdTask.id);
  });


  test('should return null for unknown ID', () => {

    // Non-existing task ko update karne ki koshish.
    const result = taskService.update(
      'unknown-id',
      {
        title: 'New title'
      }
    );


    // Task nahi mila,
    // isliye service null return karti hai.
    expect(result).toBeNull();
  });

});


// ============================================================
// 4. taskService.remove()
// ============================================================

describe('taskService.remove', () => {

  test('should remove an existing task', () => {

    // Ek task create karte hain.
    const task = taskService.create({
      title: 'Delete me'
    });


    // Task ko ID ke through delete karte hain.
    const result = taskService.remove(task.id);


    // Delete successful hone par true return hona chahiye.
    expect(result).toBe(true);


    // Delete hone ke baad same ID ka task nahi milna chahiye.
    expect(
      taskService.findById(task.id)
    ).toBeUndefined();
  });


  test('should return false for unknown ID', () => {

    // Non-existing task delete karne ki koshish.
    const result = taskService.remove('unknown-id');


    // Task exist nahi karta,
    // isliye false return hona chahiye.
    expect(result).toBe(false);
  });

});


// ============================================================
// 5. taskService.completeTask()
// ============================================================

describe('taskService.completeTask', () => {

  test('should complete an existing task', () => {

    // High-priority task create kar rahe hain.
    const task = taskService.create({
      title: 'Complete me',
      priority: 'high'
    });


    // Task ko complete kar rahe hain.
    const completedTask = taskService.completeTask(task.id);


    // Complete hone ke baad status "done" hona chahiye.
    expect(completedTask.status).toBe('done');


    // IMPORTANT:
    // Complete karne par original priority change nahi honi chahiye.
    // High hi rehni chahiye.
    expect(completedTask.priority).toBe('high');


    // Completion ke time completedAt set hona chahiye.
    expect(completedTask.completedAt).not.toBeNull();
  });


  test('should return null for unknown ID', () => {

    // Non-existing task ko complete karne ki koshish.
    const result = taskService.completeTask('unknown-id');


    // Task nahi mila,
    // isliye null return hona chahiye.
    expect(result).toBeNull();
  });

});






