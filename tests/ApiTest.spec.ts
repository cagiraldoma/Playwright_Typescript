import { test, expect } from '../fixtures/apiFixtures';

const API = '/web/index.php/api/v2';

test.describe('OrangeHRM REST API', () => {
  test('GET /pim/employees returns paginated employee list', async ({ authenticatedRequest }) => {
    const response = await authenticatedRequest.get(`${API}/pim/employees`, {
      params: { limit: 10, offset: 0 },
    });

    expect(response.status(), 'GET /pim/employees should return 200').toBe(200);

    const body = await response.json();
    expect(body, 'Response should contain "data" property').toHaveProperty('data');
    expect(body, 'Response should contain "meta" property').toHaveProperty('meta');
    expect(Array.isArray(body.data), '"data" should be an array').toBe(true);
    expect(typeof body.meta.total, '"meta.total" should be a number').toBe('number');
  });

  test('GET /leave/holidays returns holiday list for current year', async ({ authenticatedRequest }) => {
    const year = new Date().getFullYear();
    const response = await authenticatedRequest.get(`${API}/leave/holidays`, {
      params: {
        limit: 50,
        offset: 0,
        fromDate: `${year}-01-01`,
        toDate: `${year}-12-31`,
      },
    });

    expect(response.status(), 'GET /leave/holidays should return 200').toBe(200);

    const body = await response.json();
    expect(body, 'Response should contain "data" property').toHaveProperty('data');
    expect(Array.isArray(body.data), '"data" should be an array').toBe(true);
  });

  test('POST /pim/employees creates employee and DELETE cleans up', async ({ authenticatedRequest }) => {
    const createResponse = await authenticatedRequest.post(`${API}/pim/employees`, {
      data: {
        firstName: 'API',
        middleName: '',
        lastName: 'TestUser',
      },
    });

    expect(createResponse.status(), 'POST /pim/employees should return 200').toBe(200);

    const created = await createResponse.json();
    expect(created.data, 'Created employee should have "empNumber"').toHaveProperty('empNumber');
    expect(created.data.firstName, 'firstName does not match the sent value').toBe('API');
    expect(created.data.lastName, 'lastName does not match the sent value').toBe('TestUser');

    const empNumber: number = created.data.empNumber;

    const deleteResponse = await authenticatedRequest.delete(`${API}/pim/employees`, {
      data: { ids: [empNumber] },
    });

    expect(deleteResponse.status(), 'DELETE /pim/employees should return 200').toBe(200);
  });
});
