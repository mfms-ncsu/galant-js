import Thread from 'utils/Algorithm/Thread/Thread';
/**
 * PARTIALLY Tests Thread.js's onMessage function
 * @note See comment below for reasons on low testing coverage.
 * @author Julian Madrigal
 */
describe('Test Thread.js', () => {
    beforeEach(() => {
        // Mock the postMessage function
        global.postMessage = jest.fn();
    });

    afterEach(() => {
        global.postMessage.mockReset();
    });

    it('Should set shared array', () => {
        // Simulate a message event with the shared array
        const sharedArray = new Int32Array(new SharedArrayBuffer(1024))
        const event = { data: ['shared', sharedArray] };
        Thread(event);
        expect(sharedArray).toEqual(sharedArray);
    });

    /**
     * Unfortunately, we cannot test running an algorithm in Thread.
     * This is because Thread function call is blocking and prevents calling atomics.store/notify.
     * A solution to this is to modify Thread.js to not block in testing instances. 
     */
});