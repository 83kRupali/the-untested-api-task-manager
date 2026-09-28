// Supertest ko import kar rahe hain.
// Iska use API endpoints ko test karne ke liye hota hai.
const request = require('supertest');

// Express application import kar rahe hain.
const app = require('../src/app');

// Task service import kar rahe hain.
// Iska use test data ko reset karne ke liye kar rahe hain.
const taskService = require('../src/services/taskService');


// Har test se pehle ye function chalega.
// Isse previous test ka data next test ko affect nahi karega.
beforeEach(() => {
  taskService._reset();
});


// ============================================================
// 1. GET /tasks
// ============================================================

describe('GET /tasks', () => {

  test('should return an empty array initially', async () => {

    // GET request /tasks endpoint par bhej rahe hain.
    const response = await request(app)
      .get('/tasks');

    // API ko successful response dena chahiye.
    expect(response.statusCode).toBe(200);

    // Starting mein koi task nahi hai,
    // isliye response empty array hona chahiye.
    expect(response.body).toEqual([]);
  });

});


// ============================================================
// 2. POST /tasks
// ============================================================

describe('POST /tasks', () => {

  test('should create a new task', async () => {

    // POST request se new task create kar rahe hain.
    const response = await request(app)
      .post('/tasks')
      .send({
        title: 'Write tests',
        priority: 'high'
      });

    // Task successfully create hone par 201 expected hai.
    expect(response.statusCode).toBe(201);

    // Title check kar rahe hain.
    expect(response.body.title).toBe('Write tests');

    // Priority check kar rahe hain.
    expect(response.body.priority).toBe('high');

    // Status provide nahi kiya tha,
    // isliye default status "todo" hona chahiye.
    expect(response.body.status).toBe('todo');

    // Server ko task ke liye ID generate karni chahiye.
    expect(response.body).toHaveProperty('id');

    // Server ko creation time bhi generate karna chahiye.
    expect(response.body).toHaveProperty('createdAt');
  });


  test('should reject task without title', async () => {

    // Title nahi bhej rahe hain.
    const response = await request(app)
      .post('/tasks')
      .send({
        priority: 'high'
      });

    // Invalid request ke liye 400 Bad Request expected hai.
    expect(response.statusCode).toBe(400);

    // Error message response mein hona chahiye.
    expect(response.body).toHaveProperty('error');
  });

});


// ============================================================
// 3. GET /tasks?status=todo
// ============================================================

describe('GET /tasks filtering', () => {

  test('should filter tasks by status', async () => {

    // Pehla todo task create kar rahe hain.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Pending task',
        status: 'todo'
      });


    // Ek done task create kar rahe hain.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Completed task',
        status: 'done'
      });


    // Sirf todo tasks maang rahe hain.
    const response = await request(app)
      .get('/tasks?status=todo');


    // Request successful honi chahiye.
    expect(response.statusCode).toBe(200);

    // Response ke har task ka status todo hona chahiye.
    expect(
      response.body.every(task => task.status === 'todo')
    ).toBe(true);
  });

});


// ============================================================
// 4. GET /tasks?page=1&limit=2
// ============================================================

describe('GET /tasks pagination', () => {

  test('should return the correct tasks for page 1', async () => {

    // First task create kar rahe hain.
    const task1 = await request(app)
      .post('/tasks')
      .send({
        title: 'Task 1'
      });


    // Second task create kar rahe hain.
    const task2 = await request(app)
      .post('/tasks')
      .send({
        title: 'Task 2'
      });


    // Third task create kar rahe hain.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Task 3'
      });


    // Page 1 par maximum 2 tasks maang rahe hain.
    const response = await request(app)
      .get('/tasks?page=1&limit=2');


    // Request successful honi chahiye.
    expect(response.statusCode).toBe(200);

    // Page 1 mein exactly 2 tasks hone chahiye.
    expect(response.body).toHaveLength(2);


    // First returned task Task 1 hona chahiye.
    expect(response.body[0].id).toBe(task1.body.id);

    // Second returned task Task 2 hona chahiye.
    expect(response.body[1].id).toBe(task2.body.id);
  });

});


// ============================================================
// 5. PUT /tasks/:id
// ============================================================

describe('PUT /tasks/:id', () => {

  test('should update an existing task', async () => {

    // Pehle ek task create karenge.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Original Task',
        priority: 'low'
      });


    // Created task ki ID save kar rahe hain.
    const taskId = createResponse.body.id;


    // Existing task ko update kar rahe hain.
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        title: 'Updated Task',
        priority: 'high'
      });


    // Update successful hona chahiye.
    expect(response.statusCode).toBe(200);

    // ID same rehni chahiye.
    expect(response.body.id).toBe(taskId);

    // Title update hona chahiye.
    expect(response.body.title).toBe('Updated Task');

    // Priority update hona chahiye.
    expect(response.body.priority).toBe('high');
  });


  test('should return 404 when task does not exist', async () => {

    // Aisi ID use kar rahe hain jo exist nahi karti.
    const response = await request(app)
      .put('/tasks/non-existing-id')
      .send({
        title: 'Updated Task'
      });


    // Task nahi mila, therefore 404.
    expect(response.statusCode).toBe(404);

    // Error message check kar rahe hain.
    expect(response.body.error).toBe('Task not found');
  });


  test('should reject an empty title', async () => {

    // Valid task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Original Task'
      });


    // Task ID le rahe hain.
    const taskId = createResponse.body.id;


    // Empty title bhej rahe hain.
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        title: ''
      });


    // Empty title invalid hai.
    expect(response.statusCode).toBe(400);

    // Error response hona chahiye.
    expect(response.body).toHaveProperty('error');
  });

});


// ============================================================
// 6. DELETE /tasks/:id
// ============================================================

describe('DELETE /tasks/:id', () => {

  test('should delete an existing task', async () => {

    // Pehle task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to delete'
      });


    // Task ID save kar rahe hain.
    const taskId = createResponse.body.id;


    // Task delete kar rahe hain.
    const response = await request(app)
      .delete(`/tasks/${taskId}`);


    // Successful DELETE ka response 204 hona chahiye.
    expect(response.statusCode).toBe(204);

    // 204 response mein body empty honi chahiye.
    expect(response.body).toEqual({});


    // Ab saare tasks dobara get kar rahe hain.
    const getResponse = await request(app)
      .get('/tasks');


    // Deleted task list mein nahi hona chahiye.
    expect(
      getResponse.body.find(task => task.id === taskId)
    ).toBeUndefined();
  });


  test('should return 404 when deleting a non-existing task', async () => {

    // Non-existing task delete karne ki koshish.
    const response = await request(app)
      .delete('/tasks/non-existing-id');


    // Task nahi mila.
    expect(response.statusCode).toBe(404);

    // Error message check.
    expect(response.body.error).toBe('Task not found');
  });

});


// ============================================================
// 7. PATCH /tasks/:id/complete
// ============================================================

describe('PATCH /tasks/:id/complete', () => {

  test('should mark a task as completed', async () => {

    // High-priority task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Complete this task',
        priority: 'high'
      });


    // Task ID save kar rahe hain.
    const taskId = createResponse.body.id;


    // Task ko complete kar rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/complete`);


    // Request successful honi chahiye.
    expect(response.statusCode).toBe(200);

    // Same task ID honi chahiye.
    expect(response.body.id).toBe(taskId);

    // Status done hona chahiye.
    expect(response.body.status).toBe('done');

    // completedAt set hona chahiye.
    expect(response.body.completedAt).not.toBeNull();
  });


  test('should preserve the task priority when completing', async () => {

    // High-priority task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'High priority task',
        priority: 'high'
      });


    const taskId = createResponse.body.id;


    // Task complete kar rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/complete`);


    // Completion successful honi chahiye.
    expect(response.statusCode).toBe(200);

    // Status done hona chahiye.
    expect(response.body.status).toBe('done');

    // IMPORTANT:
    // Priority high hi rehni chahiye.
    expect(response.body.priority).toBe('high');
  });


  test('should return 404 when task does not exist', async () => {

    // Non-existing task ko complete karne ki request.
    const response = await request(app)
      .patch('/tasks/non-existing-id/complete');


    // Task nahi mila.
    expect(response.statusCode).toBe(404);

    // Error message check.
    expect(response.body.error).toBe('Task not found');
  });

});


// ============================================================
// 8. GET /tasks/stats
// ============================================================

describe('GET /tasks/stats', () => {

  test('should return correct task counts by status', async () => {

    // Todo task.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Todo task',
        status: 'todo'
      });


    // In-progress task.
    await request(app)
      .post('/tasks')
      .send({
        title: 'In progress task',
        status: 'in_progress'
      });


    // Done task.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Done task',
        status: 'done'
      });


    // Statistics request.
    const response = await request(app)
      .get('/tasks/stats');


    expect(response.statusCode).toBe(200);

    // Har status ka count verify kar rahe hain.
    expect(response.body.todo).toBe(1);
    expect(response.body.in_progress).toBe(1);
    expect(response.body.done).toBe(1);
  });


  test('should count an overdue incomplete task', async () => {

    // Past date ka task create kar rahe hain.
    // Isliye task overdue hona chahiye.
    await request(app)
      .post('/tasks')
      .send({
        title: 'Overdue task',
        dueDate: '2020-01-01T00:00:00.000Z'
      });


    // Stats request.
    const response = await request(app)
      .get('/tasks/stats');


    expect(response.statusCode).toBe(200);

    // Overdue count 1 hona chahiye.
    expect(response.body.overdue).toBe(1);
  });


  test('should not count a completed overdue task', async () => {

    // Past due date ke saath task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Completed overdue task',
        dueDate: '2020-01-01T00:00:00.000Z'
      });


    const taskId = createResponse.body.id;


    // Task complete kar rahe hain.
    await request(app)
      .patch(`/tasks/${taskId}/complete`);


    // Stats dobara check kar rahe hain.
    const response = await request(app)
      .get('/tasks/stats');


    expect(response.statusCode).toBe(200);

    // Completed task overdue count mein nahi aana chahiye.
    expect(response.body.overdue).toBe(0);
  });

});


// ============================================================
// 9. PATCH /tasks/:id/assign
// ============================================================

describe('PATCH /tasks/:id/assign', () => {

  test('should assign a task to a user', async () => {

    // Pehle task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to assign'
      });


    // Task ID save kar rahe hain.
    const taskId = createResponse.body.id;


    // Task ko Rupali ko assign kar rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'Rupali'
      });


    // Assignment successful hona chahiye.
    expect(response.statusCode).toBe(200);

    // Assignee Rupali honi chahiye.
    expect(response.body.assignee).toBe('Rupali');

    // Task ID same honi chahiye.
    expect(response.body.id).toBe(taskId);
  });


  test('should return 404 when task does not exist', async () => {

    // Non-existing task ko assign karne ki request.
    const response = await request(app)
      .patch('/tasks/non-existing-id/assign')
      .send({
        assignee: 'Rupali'
      });


    // Task nahi mila.
    expect(response.statusCode).toBe(404);

    // Error message check.
    expect(response.body.error).toBe('Task not found');
  });


  test('should reject an empty assignee', async () => {

    // Task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to assign'
      });


    const taskId = createResponse.body.id;


    // Empty assignee bhej rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: ''
      });


    // Empty string invalid hai.
    expect(response.statusCode).toBe(400);
  });


  test('should reject an assignee containing only spaces', async () => {

    // Task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Task to assign'
      });


    const taskId = createResponse.body.id;


    // Sirf spaces assignee ke roop mein bhej rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: '   '
      });


    // Spaces-only value invalid honi chahiye.
    expect(response.statusCode).toBe(400);
  });


  test('should allow reassignment to another user', async () => {

    // Task create kar rahe hain.
    const createResponse = await request(app)
      .post('/tasks')
      .send({
        title: 'Reassign task'
      });


    const taskId = createResponse.body.id;


    // Pehle Amit ko assign karte hain.
    await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'Amit'
      });


    // Ab same task Rupali ko assign kar rahe hain.
    const response = await request(app)
      .patch(`/tasks/${taskId}/assign`)
      .send({
        assignee: 'Rupali'
      });


    // Reassignment successful honi chahiye.
    expect(response.statusCode).toBe(200);

    // New assignee Rupali honi chahiye.
    expect(response.body.assignee).toBe('Rupali');
  });

});

























