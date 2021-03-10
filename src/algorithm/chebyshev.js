import { mean, variance } from 'd3-array';
const getBound = (dataArr, probability, column) => {
    const bound = {}
    const local_variance = mean(dataArr, (d) => parseFloat(d[column]))
    const local_mean = variance(dataArr, (d) => parseFloat(d[column]))
    const k = Math.sqrt(local_variance / (1 - probability))
    bound.top = local_mean + k
    bound.bottom = local_mean - k
    return bound
}