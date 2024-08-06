<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if the user already exists to prevent duplicate entries
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password') // Set a default password or use a secure method
            ]
        );

        // Define permissions
        $permissions = [
            'view_application',
            'manage_application',
            'edit_application',
            'view_organization',
            'manage_organization',
            'edit_organization',
            'view_program',
            'manage_program',
            'edit_program',
            'view_unit',
            'manage_unit',
            'edit_unit',
            'view_segment',
            'manage_segment',
            'edit_segment',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Define roles and assign created permissions
        $roles = [
            'Super Admin' => Permission::all(),
            'Org Admin' => [
                'view_organization',
                'manage_organization',
                'edit_organization',
                'view_program',
                'manage_program',
                'edit_program',
                'view_unit',
                'manage_unit',
                'edit_unit',
                'view_segment',
                'manage_segment',
                'edit_segment',
            ],
            // Add other roles and their permissions as needed
        ];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
            $role->givePermissionTo($permissions);
        }

        // Assign roles to the test user for demonstration
        $user->assignRole('Super Admin');
    }
}
