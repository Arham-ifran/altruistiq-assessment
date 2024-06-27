import axios from 'axios'
import assert from 'assert'

describe('Testing server', () => {
  it('Accessing root url should return 200', function(done) {
    this.timeout(5000); // increase timeout to 5 seconds
    axios.get('http://127.0.0.1:5000')
      .then((res) => {
        assert.equal(200, res.status)
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});