GlobalConfigApiServer = {
    serverUrl: 'http://bigbug.tech:8080/wdm-api'
};

GlobalConfig = {
    /**
     * 数据请求类型
     */
    requestType: 'ajax',

    /**
     * 请求超时时间
     */
    requestTimeout: 1000 * 60 * 5,

    url: {
        api: {
            upload: GlobalConfigApiServer.serverUrl + '/api/upload.api',

            user: {
                auth: GlobalConfigApiServer.serverUrl + '/api/user/auth.api',
                show: GlobalConfigApiServer.serverUrl + '/api/user/show.api',
                add: GlobalConfigApiServer.serverUrl + '/api/user/add.api',
                remove: GlobalConfigApiServer.serverUrl + '/api/user/delete.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/user/get.api',
                update: GlobalConfigApiServer.serverUrl + '/api/user/update.api'
            },
            role: {
                show: GlobalConfigApiServer.serverUrl + '/api/role/show.api',
                add: GlobalConfigApiServer.serverUrl + '/api/role/add.api',
                remove: GlobalConfigApiServer.serverUrl + '/api/role/delete.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/role/get.api',
                update: GlobalConfigApiServer.serverUrl + '/api/role/update.api',
                getAll: GlobalConfigApiServer.serverUrl + '/api/role/get_all.api'
            },
            organization: {
                loadAll: GlobalConfigApiServer.serverUrl + '/api/org/show.api',
                add: GlobalConfigApiServer.serverUrl + '/api/org/add.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/org/get.api',
                update: GlobalConfigApiServer.serverUrl + '/api/org/update.api',
                remove: GlobalConfigApiServer.serverUrl + '/api/org/delete.api'
            },
            complaint: {
                show: GlobalConfigApiServer.serverUrl + '/api/cm/complaint/show.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/cm/complaint/get.api',
                publish: GlobalConfigApiServer.serverUrl + '/api/cm/complaint/publish.api',
                unpublish: GlobalConfigApiServer.serverUrl + '/api/cm/complaint/unpublish.api'
            },
            complaintReply: {
                add: GlobalConfigApiServer.serverUrl + '/api/cm/complaint_reply/add.api',
                getLatest: GlobalConfigApiServer.serverUrl + '/api/cm/complaint_reply/get_latest.api'
            },
            event: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/event/add.api',
                showAudit: GlobalConfigApiServer.serverUrl + '/api/wdm/event/show_audit.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/wdm/event/get.api',
                audit: GlobalConfigApiServer.serverUrl + '/api/wdm/event/audit.api',
                showBulletin: GlobalConfigApiServer.serverUrl + '/api/wdm/event/show_bulletin.api',
                showSupervise: GlobalConfigApiServer.serverUrl + '/api/wdm/event/show_supervise.api',
                search: GlobalConfigApiServer.serverUrl + '/api/wdm/event/search.api',
                getOrgEvenTypeCount: GlobalConfigApiServer.serverUrl + '/api/wdm/event/org_event_type_count'
            },
            eventBulletin: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin/add.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin/get.api',
                getByEvent: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin/get_by_event.api'
            },
            eventBulletinResult: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin_result/add.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin_result/get.api',
                getByEvent: GlobalConfigApiServer.serverUrl + '/api/wdm/event_bulletin_result/get_by_event.api'
            },
            eventAudit: {
                getByEvent: GlobalConfigApiServer.serverUrl + '/api/wdm/event_audit/get_by_event.api'
            },
            eventSuperviseReport: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/event_supervise_report/add.api',
                getByEvent: GlobalConfigApiServer.serverUrl + '/api/wdm/event_supervise_report/get_by_event.api'
            },
            eventSupervisePrincipleBreaking: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/event_supervise_principle_breaking/add.api',
                getByEvent: GlobalConfigApiServer.serverUrl + '/api/wdm/event_supervise_principle_breaking/get_by_event.api'
            },
            principleBreakingReport: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report/add.api',
                addDeal: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report/add_deal.api',
                getById: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report/get.api',
                show: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report/show.api'
            },
            principleBreakingReportDeal: {
                add: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report_deal/add.api',
                getByReport: GlobalConfigApiServer.serverUrl + '/api/wdm/principle_breaking_report_deal/get_by_report.api'
            },
            wdm: {
                publicNotification: {//
                    add: GlobalConfigApiServer.serverUrl + '/api/wdm/public_notification/add.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wdm/public_notification/show.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wdm/public_notification/get.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wdm/public_notification/delete.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wdm/public_notification/update.api'
                },
                disciplinePunish: {//
                    add: GlobalConfigApiServer.serverUrl + '/api/wdm/discipline_punish/add.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wdm/discipline_punish/show.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wdm/discipline_punish/get.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wdm/discipline_punish/delete.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wdm/discipline_punish/update.api'
                },
                letterOfCommitment: {
                    add: GlobalConfigApiServer.serverUrl + '/api/wdm/letter_of_commitment/add.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wdm/letter_of_commitment/show.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wdm/letter_of_commitment/get.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wdm/letter_of_commitment/delete.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wdm/letter_of_commitment/update.api'
                },
                topicsEducation: {
                    add: GlobalConfigApiServer.serverUrl + '/api/wdm/topics_education/add.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wdm/topics_education/show.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wdm/topics_education/get.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wdm/topics_education/delete.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wdm/topics_education/update.api'
                },
                concentratedRectification: {
                    add: GlobalConfigApiServer.serverUrl + '/api/wdm/concentrated_rectification/add.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wdm/concentrated_rectification/show.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wdm/concentrated_rectification/get.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wdm/concentrated_rectification/delete.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wdm/concentrated_rectification/update.api'
                }
            },
            wem: {
                course: {
                    show: GlobalConfigApiServer.serverUrl + '/api/wem/course/show.api',
                    getLatest: GlobalConfigApiServer.serverUrl + '/api/wem/course/get_latest.api',
                    getById: GlobalConfigApiServer.serverUrl + '/api/wem/course/get.api',
                    add: GlobalConfigApiServer.serverUrl + '/api/wem/course/add.api',
                    remove: GlobalConfigApiServer.serverUrl + '/api/wem/course/delete.api',
                    get: GlobalConfigApiServer.serverUrl + '/api/wem/course/get.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wem/course/update.api'
                },
                video_course:{
                    add: GlobalConfigApiServer.serverUrl + '/api/wem/video_course/add.api',
                    update: GlobalConfigApiServer.serverUrl + '/api/wem/video_course/update.api'
                },
                courseExperience: {
                    add: GlobalConfigApiServer.serverUrl + '/api/wem/course_experience/add.api',
                    get: GlobalConfigApiServer.serverUrl + '/api/wem/course_experience/get.api',
                    show: GlobalConfigApiServer.serverUrl + '/api/wem/course_experience/show.api',
                    getExperiencedUser: GlobalConfigApiServer.serverUrl + '/api/wem/course_experience/get_experienced_user.api',
                    getNotExperiencedUser: GlobalConfigApiServer.serverUrl + '/api/wem/course_experience/get_not_experienced_user.api'
                },
                courseBrowse: {
                    add: GlobalConfigApiServer.serverUrl + '/api/wem/course_browse/add.api',
                    getBrowsedUser: GlobalConfigApiServer.serverUrl + '/api/wem/course_browse/get_browsed_user.api',
                    getNotBrowsedUser: GlobalConfigApiServer.serverUrl + '/api/wem/course_browse/get_not_browsed_user.api'
                }
            }


        }
    }

};

