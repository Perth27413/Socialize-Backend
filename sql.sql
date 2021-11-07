CREATE TABLE public.log_user (
	id serial NOT NULL,
	user_id serial NOT NULL,
	login_date timestamp(0) NULL,
	CONSTRAINT log_user_pk PRIMARY KEY (id)
);

CREATE TABLE public."role" (
	id serial NOT NULL,
	"name" varchar NULL,
	CONSTRAINT role_pk PRIMARY KEY (id)
);

CREATE TABLE public."type" (
	id serial NOT NULL,
	"name" varchar NULL,
	CONSTRAINT type_pk PRIMARY KEY (id)
);

CREATE TABLE public."user" (
	id serial NOT NULL,
	type_id serial NOT NULL,
	user_name varchar NULL,
	"password" varchar NULL,
	email varchar NULL,
	details varchar NULL,
	birthday date NULL,
	phone_num varchar NULL,
	profile_picture varchar NULL,
	last_login timestamp(0) NULL,
	role_id serial NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);

CREATE TABLE public.post (
	id serial NOT NULL,
	contents varchar NULL,
	picture varchar NULL,
	owner_id serial NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT post_pk PRIMARY KEY (id)
);

CREATE TABLE public."comment" (
	id serial NOT NULL,
	post_id serial NOT NULL,
	contents varchar NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT comment_pk PRIMARY KEY (id)
);

CREATE TABLE public.story (
	id serial NOT NULL,
	contents varchar NULL,
	picture varchar NULL,
	owner_id serial NOT NULL,
	created_at timestamp(0) NULL,
	updated_at timestamp(0) NULL,
	CONSTRAINT story_pk PRIMARY KEY (id)
);

CREATE TABLE public.follow (
	"following" serial NOT NULL,
	followed serial NOT NULL,
	CONSTRAINT follow_fk FOREIGN KEY ("following") REFERENCES public."user"(id),
	CONSTRAINT follow_fk_1 FOREIGN KEY (followed) REFERENCES public."user"(id)
);

CREATE TABLE public.post_liked (
	post_id serial NOT NULL,
	user_id serial NOT NULL,
	CONSTRAINT post_liked_fk FOREIGN KEY (post_id) REFERENCES public.post(id),
	CONSTRAINT post_liked_fk_1 FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.post_viewed (
	post_id serial NOT NULL,
	user_id serial NOT NULL,
	CONSTRAINT post_viewed_fk FOREIGN KEY (post_id) REFERENCES public.post(id),
	CONSTRAINT post_viewed_fk_1 FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.comment_liked (
	comment_id serial NOT NULL,
	user_id serial NOT NULL,
	CONSTRAINT comment_liked_fk FOREIGN KEY (comment_id) REFERENCES public."comment"(id),
	CONSTRAINT comment_liked_fk_1 FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.story_viewed (
	story_id serial NOT NULL,
	user_id serial NOT NULL,
	CONSTRAINT story_viewed_fk FOREIGN KEY (story_id) REFERENCES public.story(id),
	CONSTRAINT story_viewed_fk_1 FOREIGN KEY (user_id) REFERENCES public."user"(id)
);

ALTER TABLE public.log_user ADD CONSTRAINT log_user_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);
ALTER TABLE public."user" ADD CONSTRAINT user_fk FOREIGN KEY (type_id) REFERENCES public."type"(id);
ALTER TABLE public."user" ADD CONSTRAINT user_fk_1 FOREIGN KEY (role_id) REFERENCES public."role"(id);
ALTER TABLE public.story ADD CONSTRAINT story_fk FOREIGN KEY (owner_id) REFERENCES public."user"(id);
ALTER TABLE public."comment" ADD CONSTRAINT comment_fk FOREIGN KEY (post_id) REFERENCES public.post(id);
ALTER TABLE public."comment" ADD owner_id serial NOT NULL;
ALTER TABLE public."comment" ADD CONSTRAINT comment_fk1 FOREIGN KEY (owner_id) REFERENCES public."user"(id);

ALTER TABLE public."user" ADD first_name varchar NULL;
ALTER TABLE public."user" ADD last_name varchar NULL;
ALTER TABLE public.post ADD CONSTRAINT post_fk FOREIGN KEY (owner_id) REFERENCES public."user"(id);
ALTER TABLE public.post_liked ADD id serial NOT NULL;
ALTER TABLE public.post_liked ADD CONSTRAINT post_liked_pk PRIMARY KEY (id);

ALTER TABLE public.post_viewed ADD id serial NOT NULL;
ALTER TABLE public.post_viewed ADD CONSTRAINT post_viewed_pk PRIMARY KEY (id);

INSERT INTO public."type" ("name")
	VALUES ('socialize');
INSERT INTO public."type" ("name")
	VALUES ('google');
INSERT INTO public."type" ("name")
	VALUES ('facebook');

INSERT INTO public."role" ("name")
	VALUES ('member');
INSERT INTO public."role" ("name")
	VALUES ('admin');

