import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Octokit } from '@octokit/rest';
import { userData } from './models/user.interface';
import { UsersService } from './services/users.service';

interface CustomRequest extends Request {
  user: userData;
}

@Controller()
export class AppController {
  constructor(private readonly userService: UsersService) {}

  // Render the main layout for the index route
  @Get()
  @Render('layouts/main')
  index() {
    return { title: "True Foundry's GitHub Authorizer" };
  }

  // Redirect the user to GitHub for authentication
  @Get('/auth/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // The user will be redirected to GitHub to authorize the application.
  }

  // Handle the GitHub callback after successful authentication
  @Get('/auth/github/callback')
  @UseGuards(AuthGuard('github'))
  @Render('layouts/main')
  async githubAuthCallback(@Req() req: CustomRequest) {
    const { user } = req;
    const users = await this.userService.getUsers();
    await this.userService.createUser(user);

    // Create a JSON string from the users data
    const jsonString = JSON.stringify(users);

    // The user has authorized the application and we have access to their profile and access token.
    const { accessToken } = user;

    const octokit = new Octokit({
      auth: accessToken,
    });

    // Create a new repository for the user
    const repoName = 'True-Foundry';
    const repoDescription = 'Random Star Wars reference';

    try {
      // Create the repository using the authenticated user's account
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription,
        private: false,
        auto_init: true, // Initialize the repository with a README.md file
      });

      // Create a new file in the repository with the JSON data
      await octokit.repos.createOrUpdateFileContents({
        owner: user.username,
        repo: repoName,
        path: 'users.json',
        message: 'A JSON file containing all the users in the SQLite database and "the force!!"',
        content: Buffer.from(jsonString).toString('base64'),
      });
    } catch (err) {
      console.error(`Error creating repository: ${err.message}`);
    }

    return {
      title: "True Foundry's GitHub Authorizer",
      message: 'The Auth worked!!!',
      prompt: 'Please check your repository list',
    };
  }
}