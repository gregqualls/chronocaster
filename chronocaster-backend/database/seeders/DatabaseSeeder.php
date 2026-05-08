<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'view_application',  'manage_application',  'edit_application',
            'view_organization', 'manage_organization', 'edit_organization',
            'view_program',      'manage_program',      'edit_program',
            'view_unit',         'manage_unit',         'edit_unit',
            'view_segment',      'manage_segment',      'edit_segment',
            'control_live_event',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $roles = [
            'Super Admin' => Permission::all()->pluck('name')->all(),
            'Org Admin' => [
                'view_organization', 'manage_organization', 'edit_organization',
                'view_program',      'manage_program',      'edit_program',
                'view_unit',         'manage_unit',         'edit_unit',
                'view_segment',      'manage_segment',      'edit_segment',
                'control_live_event',
            ],
            'Director' => [
                'view_program', 'edit_program',
                'view_unit',    'manage_unit',  'edit_unit',
                'view_segment', 'manage_segment', 'edit_segment',
                'control_live_event',
            ],
            'Host' => [
                'view_program', 'view_unit', 'view_segment',
            ],
            'Viewer' => [
                'view_program', 'view_unit', 'view_segment',
            ],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->syncPermissions($rolePermissions);
        }

        $this->call(DemoSeeder::class);
    }
}
