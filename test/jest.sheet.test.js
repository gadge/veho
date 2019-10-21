import { iterateStaticMethod } from './utils/iterateStaticMethod'
import { TestAxiosAlphaVantage } from './tasks/axios.alphavantage.test'
import { SimpleMatrixTest } from './tasks/simple.matrix.test'
import { SimpleVectorTest } from './tasks/simple.vector.test'
import { SimpleJsoTest } from './tasks/simple.Ob.test'

test('TestAxiosAlphaVantage', () => {
  iterateStaticMethod(TestAxiosAlphaVantage)
})

test('MatrixTest', () => {
  iterateStaticMethod(SimpleMatrixTest)
})

test('SimpleVectorTest', () => {
  SimpleVectorTest.test_iterator()
  // iterateStaticMethod(SimpleVectorTest)
})

test('SimpleJsoTest', () => {
  iterateStaticMethod(SimpleJsoTest)
})