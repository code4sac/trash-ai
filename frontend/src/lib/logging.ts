import rlog from 'loglevel'
export const log = rlog.getLogger('trashai')
if (import.meta.env.DEV) {
    log.setLevel('debug')
} else {
    log.setLevel('info')
}
