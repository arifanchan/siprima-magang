<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    // Controller ini dikosongkan karena seluruh fungsi edit/update mahasiswa sudah dihandle oleh StudentEditController.
    // Gunakan StudentEditController untuk edit/update data mahasiswa, dan tambahkan controller baru jika ada kebutuhan lain (misal: StudentShowController untuk show data mahasiswa).
}
