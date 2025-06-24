<?php
/*
 * Copyright (c) 2025. Arifa N. Chan. All right Reserved
 * This file is part of the SIPRIMA Magang Project.
 * Developed with PhpStorm
 */

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
