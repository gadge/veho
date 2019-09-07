import { iterateStaticMethod } from './utils/iterateStaticMethod'
import { TestAxiosAlphaVantage } from './tasks/axios.alphavantage.test'
import { MatrixTest } from './tasks/simple.matrix.test'
import { SimpleVectorTest } from './tasks/simple.vector.test'
import { SimpleJsoTest } from './tasks/simple.Jso.test'

test('TestAxiosAlphaVantage', () => {
  iterateStaticMethod(TestAxiosAlphaVantage)
})

test('MatrixTest', () => {
  iterateStaticMethod(MatrixTest)
})

test('SimpleVectorTest', () => {
  SimpleVectorTest.test_iterator()
  // iterateStaticMethod(SimpleVectorTest)
})

test('SimpleJsoTest', () => {
  iterateStaticMethod(SimpleJsoTest)
})