import { prisma } from "../src/lib/prisma";

const roleNames = [
    { name: 'Admin', isSystem: true, description: 'Has all capabilities globally' },
    { name: 'Learner', isSystem: true, description: 'Enrolls and completes classes' },
    { name: 'Instructur', isSystem: true, description: 'Teaches and grades learners' },
    { name: 'Trainer', isSystem: true, description: 'Trains learners' },
    { name: 'Learning Designer', isSystem: true, description: 'Designs and manages curricula' },
];

const privileges = [
    // 1.0 Enrollment
    { resource: 'Enrollment', action: 'LEARNER_REGISTRATION', description: 'Learner registration', roles: ['Admin', 'Learner'] },
    { resource: 'Enrollment', action: 'LEARNER_ENROLLMENT', description: 'Learner enrollment', roles: ['Admin', 'Learner'] },
    { resource: 'Enrollment', action: 'CHECKOUT_CLASS', description: 'Check out class', roles: ['Admin', 'Learner'] },
    { resource: 'Enrollment', action: 'PAYMENT_GATEWAY', description: 'Payment gateway', roles: ['Admin', 'Learner'] },
    { resource: 'Enrollment', action: 'COURSE_MAPPING', description: 'Course mapping', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Enrollment', action: 'CREATE_GROUP_MAPPING', description: 'Create Group mapping', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Enrollment', action: 'EDIT_GROUP_MAPPING', description: 'Edit group mapping', roles: ['Admin', 'Learning Designer'] },

    // 2.0 Course
    { resource: 'Course', action: 'CREATE_COURSE', description: 'Create course', roles: ['Admin'] },
    { resource: 'Course', action: 'UPDATE_COURSE', description: 'Update course', roles: ['Admin'] },
    { resource: 'Course', action: 'DELETE_COURSE', description: 'Delete course', roles: ['Admin'] },
    { resource: 'Course', action: 'VIEW_SEARCH_COURSE', description: 'View & search course', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Course', action: 'VIEW_DETAIL_COURSE', description: 'View detail course', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Course', action: 'CREATE_SESSION', description: 'Create session', roles: ['Admin'] },
    { resource: 'Course', action: 'UPDATE_SESSION', description: 'Update session', roles: ['Admin'] },
    { resource: 'Course', action: 'DELETE_SESSION', description: 'Delete session', roles: ['Admin'] },
    { resource: 'Course', action: 'VIEW_SESSION', description: 'View session', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Course', action: 'START_SESSION', description: 'Start session', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Course', action: 'ADD_RECORDING', description: 'Add recording', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Course', action: 'UPDATE_RECORDING', description: 'Update recording', roles: ['Admin'] },
    { resource: 'Course', action: 'DELETE_RECORDING', description: 'Delete recording', roles: ['Admin'] },
    { resource: 'Course', action: 'CREATE_UPDATE_PRESENCE_SES', description: 'Create/ update presence & SES', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },

    // 3.0 Assignment
    { resource: 'Assignment', action: 'CREATE_UPDATE_ASSIGNMENT', description: 'Create/ update assignment', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'PRE_POST_TEST', description: 'Pre-post test', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'COURSE_ASSIGNMENT', description: 'Course assignment', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'EXERCISES', description: 'Exercises', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'FINAL_PROJECT', description: 'Final project', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'SEARCH_VIEW_ASSIGNMENT', description: 'Search & view assignment', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Assignment', action: 'DELETE_ASSIGNMENT', description: 'Delete assignment', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Assignment', action: 'START_ASSIGNMENT_INSTRUCTOR', description: 'Start assignment (instructur/ trainer)', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Assignment', action: 'START_ASSIGNMENT_LEARNER', description: 'Start assignment (learner)', roles: ['Admin', 'Learner'] },
    { resource: 'Assignment', action: 'VIEW_ASSIGNMENT_RESULT', description: 'View assignment result', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Assignment', action: 'CHECK_ASSIGNMENT_RESULT', description: 'Check assignment result', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Assignment', action: 'VIEW_ASSIGNMENT_SCORE', description: 'View assignment score', roles: ['Admin', 'Learner'] },

    // 4.0 Class
    { resource: 'Class', action: 'CREATE_UPDATE_CLASS', description: 'Create/ update class', roles: ['Admin'] },
    { resource: 'Class', action: 'DELETE_CLASS', description: 'Delete class', roles: ['Admin'] },
    { resource: 'Class', action: 'SEARCH_VIEW_CLASS', description: 'Search & view class', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Class', action: 'UPDATE_SCHEDULE_CLASS', description: 'Update schedule class', roles: ['Admin'] },
    { resource: 'Class', action: 'PLACEMENT_TEST_CREATE', description: 'Placement test create', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'PLACEMENT_TEST_UPDATE', description: 'Placement test update', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'PLACEMENT_TEST_VIEW_SEARCH', description: 'Placement test view & search', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'PLACEMENT_TEST_VIEW_DETAIL', description: 'Placement test view detail', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'PLACEMENT_TEST_CHECKING', description: 'Placement test checking', roles: ['Admin', 'Instructur', 'Trainer'] },
    { resource: 'Class', action: 'UPLOAD_CURRICULA', description: 'Upload curricula', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'UPDATE_CURRICULA', description: 'Update curricula', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'DELETE_CURRICULA', description: 'Delete curricula', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'SEARCH_VIEW_CURRICULA', description: 'Search & view curricula', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Class', action: 'VIEW_DETAIL_CURRICULA', description: 'View detail curricula', roles: ['Admin', 'Learning Designer'] },

    // 5.0 Forums
    { resource: 'Forums', action: 'CREATE_EDIT_TOPIC', description: 'Create/ edit topic', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'DELETE_SELF_TOPIC', description: 'Delete own topic', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'DELETE_OTHERS_TOPIC', description: 'Delete other users topic', roles: ['Admin'] },
    { resource: 'Forums', action: 'SEARCH_VIEW_TOPIC', description: 'Search & view topic', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'REPLY_SELF_TOPIC', description: 'Reply to own topic', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'REPLY_OTHERS_TOPIC', description: 'Reply to other users topic', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'EDIT_SELF_REPLY', description: 'Edit own reply', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'EDIT_OTHERS_REPLY', description: 'Edit other users reply', roles: ['Admin'] },
    { resource: 'Forums', action: 'DELETE_SELF_REPLY', description: 'Delete own reply', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Forums', action: 'DELETE_OTHERS_REPLY', description: 'Delete other users reply', roles: ['Admin'] },

    // 6.0 Wikis
    { resource: 'Wikis', action: 'POST_CREATE', description: 'Post create', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Wikis', action: 'POST_SEARCH_VIEW', description: 'Post search & view', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Wikis', action: 'POST_EDIT', description: 'Post edit', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Wikis', action: 'POST_DELETE', description: 'Post delete', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },

    // 7.0 Reflection & Evaluation
    { resource: 'Feedback', action: 'CREATE_EDIT_REFLECTION', description: 'Create/edit reflection', roles: ['Admin', 'Learner'] },
    { resource: 'Feedback', action: 'CREATE_EDIT_ASSIGNMENT_FEEDBACK', description: 'Create/edit Assignment feedback', roles: ['Admin', 'Instructur', 'Trainer'] },
    { resource: 'Feedback', action: 'CREATE_EDIT_PEER_FEEDBACK', description: 'Create/edit Peer feedback', roles: ['Admin', 'Learner'] },
    { resource: 'Feedback', action: 'CREATE_EDIT_CLASS_FEEDBACK', description: 'Create/edit class feedback', roles: ['Admin', 'Learner', 'Instructur', 'Trainer'] },
    { resource: 'Feedback', action: 'CREATE_EDIT_TRAINER_FEEDBACK', description: 'Create/edit Trainer feedback', roles: ['Admin', 'Instructur', 'Trainer'] },
    { resource: 'Feedback', action: 'DELETE_REFLECTION', description: 'Delete reflection', roles: ['Admin', 'Learner'] },
    { resource: 'Feedback', action: 'VIEW_SEARCH_REFLECTION', description: 'View & search reflection', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'VIEW_DETAIL_REFLECTION', description: 'View detail reflection', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'DELETE_ASSIGNMENT_FEEDBACK', description: 'Delete assignment feedback', roles: ['Admin', 'Instructur', 'Trainer'] },
    { resource: 'Feedback', action: 'VIEW_SEARCH_ASSIGNMENT_FEEDBACK', description: 'View & search assignment feedback', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'VIEW_DETAIL_ASSIGNMENT_FEEDBACK', description: 'View detail assignment feedback', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'DELETE_PEER_FEEDBACK', description: 'delete peer feedback', roles: ['Admin', 'Learner'] },
    { resource: 'Feedback', action: 'VIEW_SEARCH_PEER_FEEDBACK', description: 'View & search peer feedback', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'VIEW_DETAIL_PEER_FEEDBACK', description: 'View detail peer feedback', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Feedback', action: 'DELETE_TRAINER_FEEDBACK', description: 'delete trainer feedback', roles: ['Admin', 'Learner'] },
    { resource: 'Feedback', action: 'VIEW_SEARCH_TRAINER_FEEDBACK', description: 'View & search trainer feedback', roles: ['Admin', 'Learning Designer'] },
    { resource: 'Feedback', action: 'VIEW_DETAIL_TRAINER_FEEDBACK', description: 'View detail trainer feedback', roles: ['Admin', 'Learning Designer'] },

    // 8.0 User management
    { resource: 'User', action: 'CREATE_EDIT_USER', description: 'Create/ edit user', roles: ['Admin'] },
    { resource: 'User', action: 'VIEW_DETAIL_USER', description: 'View detail user', roles: ['Admin'] },
    { resource: 'User', action: 'DELETE_USER', description: 'Delete user', roles: ['Admin'] },
    { resource: 'User', action: 'VIEW_SEARCH_USER', description: 'View & search user', roles: ['Admin'] },

    // 9.0 File management
    { resource: 'File', action: 'UPLOAD_FILE', description: 'Upload file', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'File', action: 'ATTACH_FILE', description: 'Attach file', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'File', action: 'DELETE_FILE', description: 'Delete file', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'File', action: 'EDIT_ATTACHMENT', description: 'Edit attachment', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'File', action: 'SEARCH_VIEW_FILE', description: 'Search & View file', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'File', action: 'VIEW_DETAIL_FILE', description: 'Vie detail file', roles: ['Admin', 'Learner', 'Instructur', 'Trainer', 'Learning Designer'] },

    // 10.0 Analytics & Report
    { resource: 'Analytics', action: 'ANALYTICS_REPORT_LEARNER', description: 'Analytics report learner', roles: ['Admin', 'Learner', 'Learning Designer'] },
    { resource: 'Analytics', action: 'LEARNER_REPORT', description: 'Learner report', roles: ['Admin', 'Learner', 'Learning Designer'] },
    { resource: 'Analytics', action: 'ANALYTICS_REPORT_TRAINER', description: 'Analytics report trainer', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
    { resource: 'Analytics', action: 'TRAINER_REPORT', description: 'Trainer report', roles: ['Admin', 'Instructur', 'Trainer', 'Learning Designer'] },
];


async function main() {
    console.log('Start seeding...');

    try {
        // 1. Create Roles
        const createdRoles = new Map();
        for (const roleDef of roleNames) {
            const role = await prisma.role.upsert({
                where: { name: roleDef.name },
                update: { description: roleDef.description },
                create: roleDef,
            });
            createdRoles.set(role.name, role);
        }
        console.log('Roles seeded.');

        // 2. Create Permissions
        const createdPerms = new Map();
        for (const priv of privileges) {
            const permKey = `${priv.resource}_${priv.action}`;
            const perm = await prisma.permission.upsert({
                where: {
                    resource_action: {
                        resource: priv.resource,
                        action: priv.action,
                    },
                },
                update: { description: priv.description },
                create: {
                    resource: priv.resource,
                    action: priv.action,
                    description: priv.description,
                },
            });
            createdPerms.set(permKey, perm);
        }
        console.log('Permissions seeded.');

        // 3. Delete existing map to avoid duplicates/stale mapping
        await prisma.rolePermission.deleteMany();

        // 4. Assign permissions to roles
        let mappingCount = 0;
        for (const priv of privileges) {
            const permKey = `${priv.resource}_${priv.action}`;
            const perm = createdPerms.get(permKey);

            for (const roleName of priv.roles) {
                const role = createdRoles.get(roleName);
                if (role && perm) {
                    await prisma.rolePermission.create({
                        data: {
                            roleId: role.id,
                            permissionId: perm.id,
                        }
                    });
                    mappingCount++;
                }
            }
        }
        console.log(`Mapped ${mappingCount} permissions to roles based on privileges table.`);
        console.log('Seeding finished successfully.');

    } catch (e) {
        console.error('Seeding failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
