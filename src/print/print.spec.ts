import { print } from './print'

describe('print', () => {
  it('calls console.log', () => {
    spyOn(console, 'log')

    let message = 'msg'
    print(message)

    expect(console.log).toHaveBeenCalledWith(message)
  })
})
